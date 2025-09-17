export default function GetSessionID(): string {
  return process.env.NEXT_PUBLIC_SESSION_ID || "916215937";
}
