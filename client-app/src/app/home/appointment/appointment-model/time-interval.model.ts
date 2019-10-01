export class TimeInterval {
  public startTime: string;
  public endTime: string;
  public interv: number;

  constructor(
    startTime: string,
    endTime: string,
    timeIntervalDuration: number
  ) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.interv = timeIntervalDuration;
  }
}
