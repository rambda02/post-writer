import cron from "node-cron"; // スケジュールされたタスク実行のための cron ライブラリ
import fetch from "node-fetch"; // HTTP リクエストを行うための fetch ライブラリ
import dotenv from "dotenv"; // 環境変数を管理するための dotenv ライブラリ

dotenv.config(); // .env ファイルから環境変数を読み込む

// CRON_SECRET と NEXT_PUBLIC_APP_URL を環境変数から取得する
const CRON_SECRET = process.env.CRON_SECRET || "development-secret";
const NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// cron ジョブの設定
const cronJobs = [
  {
    path: "/api/cron/cleanup-tokens",
    schedule: "* * * * *", // 開発中は毎分実行 (本番では '0 0 * * *')
    description: "Clean up expired tokens",
  },
  // 他の cron ジョブがあればここに追加
];

// cron ジョブを実行する関数
async function runCronJob(job) {
  // NEXT_PUBLIC_APP_URL と job.path を組み合わせて URL を作成する
  const url = `${NEXT_PUBLIC_APP_URL}${job.path}`;

  // 実行日時とジョブの説明をログに出力する
  console.log(
    `\n[${new Date().toISOString()}] Running cron job: ${job.description}`
  );

  // 実行するエンドポイントをログに出力する
  console.log(`Endpoint: ${url}`);

  try {
    // エンドポイントにリクエストを送信する
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${CRON_SECRET}`,
      },
    });

    // レスポンスのコンテンツタイプを取得する
    const contentType = response.headers.get("content-type");

    // レスポンスのコンテンツタイプが application/json の場合
    if (contentType && contentType.includes("application/json")) {
      // レスポンスのデータを JSON 形式で取得する
      const data = await response.json();

      // レスポンスのステータスコードをログに出力する
      console.log(`Status: ${response.status}`);

      // レスポンスのデータを JSON 形式でログに出力する
      console.log("Response:", JSON.stringify(data, null, 2));
    } else {
      // レスポンスのテキストを取得する
      const text = await response.text();

      // レスポンスのステータスコードをログに出力する
      console.log(`Status: ${response.status}`);

      // レスポンスのテキストをログに出力する
      console.log("Response:", text);
    }
  } catch (error) {
    // エラーをログに出力する
    console.error("Error:", error.message);
  }
}

// 手動実行のオプションが指定されている場合
if (process.argv.includes("--run-now")) {
  // 実行日時とジョブの説明をログに出力する
  console.log("Running all cron jobs immediately...");
  // すべての cron ジョブを即時実行する
  cronJobs.forEach((job) => runCronJob(job));
}

// cron ジョブをスケジュール
cronJobs.forEach((job) => {
  // スケジュールされたジョブの説明とスケジュールをログに出力する
  console.log(`Scheduled job: ${job.description} (${job.schedule})`);
  // スケジュールされたジョブを実行する
  cron.schedule(job.schedule, () => runCronJob(job));
});

// クーロンシミュレーターが起動したことをログに出力する
console.log("Cron simulator started. Press Ctrl+C to exit.");
