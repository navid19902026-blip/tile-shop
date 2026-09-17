import { getLoyaltySettings } from "@/lib/loyalty";
import LoyaltySettingsForm from "@/components/admin/loyalty-settings-form";

export default async function AdminLoyaltyPage() {
  const settings = await getLoyaltySettings();

  return (
    <div>
      <h1 className="mb-6 text-xl font-extrabold text-slate-900">تنظیمات باشگاه مشتریان</h1>
      <div className="max-w-2xl">
        <LoyaltySettingsForm settings={settings} />
      </div>
    </div>
  );
}
