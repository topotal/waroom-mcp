import axios, { AxiosInstance } from 'axios';

interface WaroomClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export class WaroomClient {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;

  constructor({ apiKey, baseUrl = 'https://api.app.waroom.com/api/v0' }: WaroomClientConfig) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getIncidents(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/incidents`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get incidents: ${error}`);
    }
  }

  async getIncidentDetails(incidentUuid: string) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/incidents/${incidentUuid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get incident details: ${error}`);
    }
  }

  async getPostmortems(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/postmortems`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get postmortems: ${error}`);
    }
  }
}
