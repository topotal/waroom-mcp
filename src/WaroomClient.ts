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
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  }

  async getIncidents(page = 1, perPage = 50, filters: any = {}) {
    try {
      const params: any = { page, per_page: perPage };
      
      // フィルターパラメーターを追加
      if (filters.service_names?.length) params.service_names = filters.service_names.join(',');
      if (filters.status) params.status = filters.status;
      if (filters.root_cause) params.root_cause = filters.root_cause;
      if (filters.severities?.length) params.severities = filters.severities.join(',');
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.includes_experimental !== undefined) params.includes_experimental = filters.includes_experimental;
      if (filters.label_names?.length) params.label_names = filters.label_names.join(',');
      if (filters.commander_id) params.commander_id = filters.commander_id;

      const response = await this.axiosInstance.get(`${this.baseUrl}/internal/incidents`, { params });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get incidents: ${error}`);
    }
  }

  async getIncidentDetails(incidentUuid: string) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/internal/incidents/${incidentUuid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get incident details: ${error}`);
    }
  }

  async getPostmortems(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/internal/postmortems`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get postmortems: ${error}`);
    }
  }

  async createPostmortem(title: string, blob: string, incidentUuids: string[], status?: string) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/internal/postmortems`, {
        title,
        blob,
        incident_uuids: incidentUuids,
        status
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create postmortem: ${error}`);
    }
  }

  async getServiceArchitectureContexts(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/internal/service_architecture_contexts`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get service architecture contexts: ${error}`);
    }
  }

  async createServiceArchitectureContext(serviceName: string, blob: string) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/internal/service_architecture_contexts`, {
        service_architecture_context: {
          service_name: serviceName,
          blob
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service architecture context: ${error}`);
    }
  }

  async getServices(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/internal/services`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get services: ${error}`);
    }
  }
}
