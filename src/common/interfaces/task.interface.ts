// interface for task listener payload 
export interface TaskAssignedEventPayload {
  email: string;
  title: string;
}

export interface TaskStatusUpdatedEventPayload {
    email: string;
    title: string;
    status: string;
}