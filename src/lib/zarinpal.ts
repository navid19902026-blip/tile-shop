const isSandbox = process.env.ZARINPAL_SANDBOX === "true";
const API_BASE = isSandbox ? "https://sandbox.zarinpal.com" : "https://api.zarinpal.com";
const GATEWAY_BASE = isSandbox ? "https://sandbox.zarinpal.com" : "https://www.zarinpal.com";

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID ?? "";

type ZarinpalRequestResponse = {
  data: { code: number; message: string; authority: string; fee_type?: string; fee?: number };
  errors: unknown[] | Record<string, unknown>;
};

type ZarinpalVerifyResponse = {
  data: { code: number; message: string; card_hash?: string; card_pan?: string; ref_id?: number; fee_type?: string; fee?: number };
  errors: unknown[] | Record<string, unknown>;
};

/** Toman amount -> Rial, as required by Zarinpal's API. */
function tomanToRial(amountToman: number) {
  return amountToman * 10;
}

export async function requestPayment(params: {
  amountToman: number;
  description: string;
  callbackUrl: string;
  mobile?: string;
  email?: string;
}): Promise<{ ok: true; authority: string; paymentUrl: string } | { ok: false; message: string }> {
  const res = await fetch(`${API_BASE}/pg/v4/payment/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: tomanToRial(params.amountToman),
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: { mobile: params.mobile, email: params.email },
    }),
  });

  const json = (await res.json()) as ZarinpalRequestResponse;

  if (json.data?.code === 100) {
    return {
      ok: true,
      authority: json.data.authority,
      paymentUrl: `${GATEWAY_BASE}/pg/StartPay/${json.data.authority}`,
    };
  }

  return { ok: false, message: json.data?.message ?? "خطا در اتصال به درگاه پرداخت" };
}

export async function verifyPayment(params: {
  amountToman: number;
  authority: string;
}): Promise<{ ok: true; refId: number } | { ok: false; message: string; code?: number }> {
  const res = await fetch(`${API_BASE}/pg/v4/payment/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: MERCHANT_ID,
      amount: tomanToRial(params.amountToman),
      authority: params.authority,
    }),
  });

  const json = (await res.json()) as ZarinpalVerifyResponse;

  // 100 = newly verified, 101 = already verified (also treated as success)
  if (json.data?.code === 100 || json.data?.code === 101) {
    return { ok: true, refId: json.data.ref_id ?? 0 };
  }

  return { ok: false, message: json.data?.message ?? "پرداخت تایید نشد", code: json.data?.code };
}
