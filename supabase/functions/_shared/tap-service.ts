
import { TapPayload } from './payment-types.ts';

const TAP_API_URL = "https://api.tap.company/v2/charges";

export class TapService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCharge(payload: TapPayload) {
    const response = await fetch(TAP_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  }

  async verifyCharge(chargeId: string) {
    const response = await fetch(`${TAP_API_URL}/${chargeId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}

