const padTime = (value: number) => value.toString().padStart(2, "0");

export const shiftTimeLabelByHours = (
  label: string,
  offsetHours: number
): string => {
  const millisecondsPerHour = 3_600_000;
  const parsedDate = new Date(label);

  if (!Number.isNaN(parsedDate.getTime())) {
    const shifted = new Date(
      parsedDate.getTime() + offsetHours * millisecondsPerHour
    );
    return shifted.toISOString().substring(11, 19);
  }

  const parts = label.split(":");
  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = parts.length > 2 ? Number(parts[2]) : 0;

    if ([hours, minutes, seconds].some((value) => Number.isNaN(value))) {
      return label;
    }

    let totalSeconds =
      hours * 3600 + minutes * 60 + seconds + offsetHours * 3600;
    totalSeconds = ((totalSeconds % 86400) + 86400) % 86400;

    const newHours = Math.floor(totalSeconds / 3600);
    const newMinutes = Math.floor((totalSeconds % 3600) / 60);
    const newSeconds = totalSeconds % 60;

    return [padTime(newHours), padTime(newMinutes), padTime(newSeconds)].join(
      ":"
    );
  }

  return label;
};
