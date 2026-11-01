export interface AudioTranscription {
  text: string;
  engine: "whisper";
  language?: string;
  model?: string;
  durationSeconds?: number;
  audioSha256?: string;
}
