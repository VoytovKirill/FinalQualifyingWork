import {apiClient} from 'api';
import {NotificationDto} from 'api/dto/Notification';

class NotificationsService {
  private getUrl(endPoint: string) {
    return `Notifications/${endPoint}`;
  }

  getNotifications() {
    return apiClient.get<NotificationDto[]>(this.getUrl(''));
  }

  deleteNotification(id: number) {
    return apiClient.delete(this.getUrl(String(id)));
  }

  readNotification(id: number) {
    return apiClient.put(this.getUrl(`read/${id}`));
  }
}

export const notificationsService = new NotificationsService();
