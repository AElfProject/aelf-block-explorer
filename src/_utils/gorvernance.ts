export function getBPCount(status, expiredAt, releasedAt) {
  const currentTime = new Date().getTime();
  const expiredTime = new Date(expiredAt).getTime();
  const releasedTime = new Date(releasedAt).getTime();

  if (status === proposalStatus.RELEASED) {
    return getBpRecordTime(releasedTime);
  }
  if (status === proposalStatus.EXPIRED) {
    return getBpRecordTime(expiredTime);
  }
  return getBpRecordTime(currentTime);
}
