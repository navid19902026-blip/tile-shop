import Anthropic from "@anthropic-ai/sdk";
import type { MessageParam, ToolUnion, ToolResultBlockParam } from "@anthropic-ai/sdk/resources/messages";
import { CATEGORY_SLUGS, getCatalogSummary, searchProductsForChat, type ProductSearchParams } from "@/lib/chat-catalog";
import { COLOR_EN_VALUES } from "@/lib/product-i18n";
import { FEATURED_BRANDS } from "@/lib/brands";
import { formatPrice, formatNumber } from "@/lib/utils";

const MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 600;
const MAX_TOOL_ROUNDS = 3;

const SHIPPING_COST = 350_000;
const FREE_SHIPPING_THRESHOLD = 15_000_000;

const LOCALE_NAME: Record<string, string> = {
  fa: "Persian (Farsi)",
  az: "Azerbaijani",
  en: "English",
  ka: "Georgian",
};

const CONTACT: Record<string, { phone: string; address: string }> = {
  fa: { phone: "۰۲۱-۱۲۳۴۵۶۷۸", address: "تهران، خیابان کاشی‌سازان، پلاک ۱" },
  en: { phone: "021-12345678", address: "Tehran, Kashi-sazan St., No. 1" },
  az: { phone: "021-12345678", address: "Tehran, Kaşi-sazan küçəsi, 1 saylı bina" },
  ka: { phone: "021-12345678", address: "თეირანი, ქაშისაზანის ქუჩა, კორპუსი 1" },
};

export const FALLBACK_MESSAGE: Record<string, string> = {
  fa: "در حال حاضر امکان پاسخ خودکار نیست. پیام شما برای پشتیبان انسانی ارسال شد و به‌زودی پاسخ داده می‌شود.",
  en: "Automatic replies aren't available right now. Your message has been sent to a human agent and will be answered shortly.",
  az: "Hazırda avtomatik cavab mümkün deyil. Mesajınız insan dəstək agentinə göndərildi və tezliklə cavablandırılacaq.",
  ka: "ამჟამად ავტომატური პასუხი შეუძლებელია. თქვენი შეტყობინება გაეგზავნა ადამიანურ აგენტს და მალე გიპასუხებთ.",
};

const CATEGORY_LABEL: Record<string, string> = {
  "wall-tile": "Wall Tile",
  "floor-tile": "Floor Tile",
  ceramic: "Ceramic",
  porcelain: "Porcelain",
};

let anthropicClient: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  anthropicClient ??= new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

const TOOLS: ToolUnion[] = [
  {
    name: "search_products",
    description:
      "Search the store's real product catalog by category, brand, color, and/or price range (in Toman). Always use this before answering any question about specific products, prices, colors, sizes, or availability — never invent or guess product names, prices, or stock status.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", enum: [...CATEGORY_SLUGS], description: "Product category slug" },
        brand: { type: "string", enum: FEATURED_BRANDS.map((b) => b.nameEn), description: "Brand name" },
        color: { type: "string", enum: COLOR_EN_VALUES, description: "Color" },
        minPriceToman: { type: "number", description: "Minimum price in Iranian Toman" },
        maxPriceToman: { type: "number", description: "Maximum price in Iranian Toman" },
        query: { type: "string", description: "Free-text fallback search (e.g. a design/collection name)" },
      },
    },
  },
  {
    name: "request_human_handoff",
    description:
      "Call this when the customer explicitly asks for a human/support agent, asks about a specific existing order or their account (you have no access to order or account data), has a complaint, refund, or payment problem, or asks anything you cannot confidently answer. After calling it, still write a short, warm closing message telling them a human team member will follow up shortly — never go silent.",
    input_schema: {
      type: "object",
      properties: { reason: { type: "string", description: "Short internal note on why this was escalated" } },
    },
  },
];

async function buildSystemPrompt(locale: string): Promise<string> {
  const summary = await getCatalogSummary();
  const contact = CONTACT[locale] ?? CONTACT.en;
  const currency = locale === "fa" ? "Toman" : "USD (approximate, converted from Toman)";

  const categoryLines = summary.categories
    .map((c) => {
      const label = CATEGORY_LABEL[c.slug] ?? c.slug;
      const range =
        c.minPrice != null && c.maxPrice != null
          ? `${formatPrice(c.minPrice, locale)}–${formatPrice(c.maxPrice, locale)}`
          : "no products currently";
      return `- ${label}: ${formatNumber(c.count, "en")} products, price range ${range}`;
    })
    .join("\n");

  return `You are the friendly online shopping assistant for "Parsian Ceram" (پارسیان سرام), an Iranian online store selling wall tile, floor tile, ceramic, and porcelain, shipping nationwide across Iran and exporting to the Caucasus (Azerbaijan, Georgia).

ALWAYS reply in ${LOCALE_NAME[locale] ?? "English"} by default, unless the customer clearly writes in a different one of the site's 4 supported languages (Persian, Azerbaijani, English, Georgian) — in that case, match their language instead.

Store facts (only rely on these plus tool results — never invent facts):
- Total products: ${summary.productCount}, across these categories:
${categoryLines}
- Brands carried (official representative, all with an authenticity guarantee): ${summary.brands.join(", ")}.
- Shipping: express post or motorcycle courier (Tehran only), flat rate ${formatPrice(SHIPPING_COST, locale)}, FREE on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD, locale)}.
- Loyalty Club: earn 1 point per ${formatPrice(summary.loyalty.pointsPerToman, locale)} spent; each point is worth ${formatPrice(summary.loyalty.pointValueInToman, locale)} off. Silver tier from ${formatPrice(summary.loyalty.silverThreshold, locale)} in total purchases (${summary.loyalty.silverDiscountPercent}% automatic discount on every order); Gold tier from ${formatPrice(summary.loyalty.goldThreshold, locale)} (${summary.loyalty.goldDiscountPercent}% automatic discount).
- Payment: secure online payment via the Zarinpal gateway.
- Prices shown to this customer are in ${currency}.
- Contact: phone ${contact.phone}, address ${contact.address}.

Use the search_products tool for any question about specific products, prices, colors, sizes, or availability. Present a few of the best matches with name, price, and a short note. Product links look like /products/{slug} from the tool result — never fabricate a slug yourself.

Use the request_human_handoff tool for order/account-specific questions, complaints, refunds, payment problems, or anything you're not confident about, or if the customer asks for a person. Always follow it with a short warm message saying a human will follow up soon.

Keep replies concise (2–5 sentences typically), warm, and helpful. Do not invent policies, discount codes, or facts beyond what's given here.`;
}

type HistoryItem = { role: "USER" | "ADMIN" | "AI"; message: string };

function toAnthropicMessages(history: HistoryItem[]): MessageParam[] {
  const merged: MessageParam[] = [];
  for (const h of history) {
    const role: "user" | "assistant" = h.role === "USER" ? "user" : "assistant";
    const last = merged[merged.length - 1];
    if (last && last.role === role && typeof last.content === "string") {
      last.content += "\n" + h.message;
    } else {
      merged.push({ role, content: h.message });
    }
  }
  while (merged.length && merged[0].role !== "user") merged.shift();
  return merged;
}

export async function generateAiReply(locale: string, history: HistoryItem[]): Promise<{ text: string; handoff: boolean }> {
  const client = getClient();
  if (!client) return { text: FALLBACK_MESSAGE[locale] ?? FALLBACK_MESSAGE.en, handoff: true };

  try {
    const system = await buildSystemPrompt(locale);
    const messages = toAnthropicMessages(history);
    if (messages.length === 0) return { text: FALLBACK_MESSAGE[locale] ?? FALLBACK_MESSAGE.en, handoff: true };

    let handoff = false;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system,
        tools: TOOLS,
        messages,
      });

      const textParts: string[] = [];
      const toolResults: ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type === "text") {
          textParts.push(block.text);
        } else if (block.type === "tool_use") {
          if (block.name === "request_human_handoff") {
            handoff = true;
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: "acknowledged" });
          } else if (block.name === "search_products") {
            const results = await searchProductsForChat(block.input as ProductSearchParams, locale);
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(results) });
          } else {
            toolResults.push({ type: "tool_result", tool_use_id: block.id, content: "unknown tool", is_error: true });
          }
        }
      }

      if (response.stop_reason !== "tool_use") {
        const text = textParts.join("\n\n").trim();
        return { text: text || (FALLBACK_MESSAGE[locale] ?? FALLBACK_MESSAGE.en), handoff };
      }

      messages.push({ role: "assistant", content: response.content });
      messages.push({ role: "user", content: toolResults });
    }

    return { text: FALLBACK_MESSAGE[locale] ?? FALLBACK_MESSAGE.en, handoff: true };
  } catch (err) {
    console.error("[chat-ai] generateAiReply failed:", err);
    return { text: FALLBACK_MESSAGE[locale] ?? FALLBACK_MESSAGE.en, handoff: true };
  }
}
