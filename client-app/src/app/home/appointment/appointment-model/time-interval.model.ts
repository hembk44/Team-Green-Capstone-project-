export class TimeInterval {
  public startTime: string;
  public endTime: string;
  public timeIntervalDuration: number;

  constructor(
    startTime: string,
    endTime: string,
    timeIntervalDuration: number
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.timeIntervalDuration = timeIntervalDuration;
  }
}
