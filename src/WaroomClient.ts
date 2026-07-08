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

      const response = await this.axiosInstance.get(`${this.baseUrl}/incidents`, { params });
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

  async createPostmortem(title: string, blob: string, incidentUuids: string[], status?: string) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/postmortems`, {
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


  async getServices(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/services`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get services: ${error}`);
    }
  }

  async getPostmortemTemplate() {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/postmortem_template`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get postmortem template: ${error}`);
    }
  }

  async getServiceArchitectureContext(serviceName: string) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/services/${serviceName}/service_architecture_context`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get service architecture context: ${error}`);
    }
  }

  async updateServiceArchitectureContext(serviceName: string, blob: string) {
    try {
      const response = await this.axiosInstance.patch(`${this.baseUrl}/services/${serviceName}/service_architecture_context`, {
        service_architecture_context: {
          blob
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update service architecture context: ${error}`);
    }
  }

  async createIncident(serviceNameorId: string, title: string, severity: string, description?: string, experimental?: boolean, isPrivate?: boolean) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/incidents`, {
        incident: {
          service_name: serviceNameorId,
          title,
          severity,
          description,
          experimental: experimental ?? false,
          is_private: isPrivate ?? false
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create incident: ${error}`);
    }
  }

  async updateIncidentSeverity(incidentUuid: string, severity: string) {
    try {
      const response = await this.axiosInstance.put(`${this.baseUrl}/incidents/${incidentUuid}/severity`, {
        severity
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update incident severity: ${error}`);
    }
  }

  async updateIncidentStatus(incidentUuid: string, status: string) {
    try {
      const response = await this.axiosInstance.put(`${this.baseUrl}/incidents/${incidentUuid}/status`, {
        status
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update incident status: ${error}`);
    }
  }

  async createIncidentMetrics(incidentUuid: string, activityAction: string, triggeredAt: string) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/incidents/${incidentUuid}/metrics`, {
        activity_action: activityAction,
        triggered_at: triggeredAt
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create incident metrics: ${error}`);
    }
  }

  async getServiceLabels(serviceName: string, page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/services/${serviceName}/labels`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get service labels: ${error}`);
    }
  }

  async createServiceLabel(serviceName: string, name: string, color: string) {
    try {
      const response = await this.axiosInstance.post(`${this.baseUrl}/services/${serviceName}/labels`, {
        label: {
          name,
          color
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create service label: ${error}`);
    }
  }

  async updateServiceLabel(serviceName: string, labelUuid: string, name: string, color: string) {
    try {
      const response = await this.axiosInstance.patch(`${this.baseUrl}/services/${serviceName}/labels/${labelUuid}`, {
        label: {
          name,
          color
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update service label: ${error}`);
    }
  }

  async deleteServiceLabel(serviceName: string, labelUuid: string) {
    try {
      const response = await this.axiosInstance.delete(`${this.baseUrl}/services/${serviceName}/labels/${labelUuid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete service label: ${error}`);
    }
  }

  async getRunbooks(page = 1, perPage = 50) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/runbooks`, {
        params: { page, per_page: perPage }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get runbooks: ${error}`);
    }
  }

  async getRunbook(namespace: string) {
    try {
      const response = await this.axiosInstance.get(`${this.baseUrl}/runbooks/${this.encodeNamespacePath(namespace)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get runbook: ${error}`);
    }
  }

  async updateRunbook(namespace: string, updates: { namespace?: string; blob?: string }) {
    try {
      const response = await this.axiosInstance.patch(`${this.baseUrl}/runbooks/${this.encodeNamespacePath(namespace)}`, {
        runbook: updates
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update runbook: ${error}`);
    }
  }

  // namespace はスラッシュを含むパスなので、セグメント単位でエンコードする
  private encodeNamespacePath(namespace: string) {
    return namespace.replace(/^\//, '').split('/').map(encodeURIComponent).join('/');
  }

  async updateIncidentLabels(incidentUuid: string, labelUuids: string[]) {
    try {
      const response = await this.axiosInstance.patch(`${this.baseUrl}/incidents/${incidentUuid}/labels`, {
        label_uuids: labelUuids
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update incident labels: ${error}`);
    }
  }
}
