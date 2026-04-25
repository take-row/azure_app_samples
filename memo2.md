# API経由でのGemini実行方法

アプリ内部にLLMを組み込み、ユーザーに対してより高度で柔軟なコンテンツを提供したいと考える場面がますます増えています。\
そこで今回は、Google社が提供する生成AIモデル「Gemini」をAPI経由で呼び出し、アプリから利用する方法について紹介します。

## Gemini APIには大きく2つの利用方法がある

Gemini APIを使う代表的な方法は次の2つです。

### 1. Google AI Studio から使う方法

Google公式の開発者向けツールであるGoogle AI Studioから、Gemini APIキーを発行することでAPIを実行することができます。\
APIキーはGoogle AI Studio上から作成することができ、API実行に関しては最も手軽な手段となっています。

#### 特徴

複雑な環境設定や構築等が不要で、とにかく手軽にAPIを実行することが可能です。POC等での試用や、利用者が限定されている個人開発等に向いています。\
さらに無料で実行できる料金体系も用意されており、コストもかけずにAPIを実行することが可能です。\
ただし、本番環境や大規模アプリ等で使用する場合には、APIキーのみでの認証管理や監査ログ等の運用面において不足部分があるため注意が必要です。

#### 実行例

Google AI StuidioからAPIキーを取得しセットした上で、エンドポイントへのリクエストを実行します。

```bash
export GEMINI_API_KEY="YOUR_API_KEY"

curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "日本の歴代総理大臣について教えて"
          }
        ]
      }
    ]
  }'
```

### 2. Vertex AI から使う方法

Google Cloud 上で機械学習や生成AIを開発・運用するための統合プラットフォームである、Vertex AIを経路してAPIを実行することが可能です。\
Google Cloud プロジェクト、課金設定、API 有効化、認証方式の設定が必要で、\
認証は主にADC（Application Default Credentials）か、条件付きでサービスアカウントに紐づくAPIキーを用いての実行となります。

#### 特徴

Vertex AIの強みは、Google Cloudの運用基盤に載せられることが大きな利点です。
IAMによるアクセス制御や、Cloud Audit Logs による監査、リクエスト/レスポンスのログ保存など、本番アプリや企業利用で欲しくなる機能が揃っています。\
こうした点から、大規模アプリや本番環境、またガバナンスが必要な条件下においては VertexAIの利用が推奨されます。

#### 実行例

Vertex AIでは、事前にGoogle Cloudプロジェクトの作成や課金設定、必要なAPIの有効化を行ったうえで、\
`gcloud auth print-access-token`により取得したアクセストークンを利用してAPIを実行します。\
Google AI StudioのようにAPIキーを直接渡すのではなく、Google Cloudの認証基盤を利用してリクエストを送る点が大きな違いです。

```bash
export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
export GOOGLE_CLOUD_LOCATION="global"
export API_ENDPOINT="https://aiplatform.googleapis.com"
export MODEL_ID="gemini-3-flash-preview"
export GENERATE_CONTENT_API="generateContent"

curl \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  "${API_ENDPOINT}/v1/projects/${GOOGLE_CLOUD_PROJECT}/locations/${GOOGLE_CLOUD_LOCATION}/publishers/google/models/${MODEL_ID}:${GENERATE_CONTENT_API}" \
  -d '{
    "contents": {
      "role": "user",
      "parts": {
        "text": "日本の歴代総理大臣について教えて"
      }
    }
  }'
```

## まとめ

今回はGeminiをAPI経由で実行する2つの方法について紹介を行いました。

| 観点 | Google AI Studio | Vertex AI |
|---|---|---|
| 始めやすさ | 容易 | やや準備が必要 |
| 主な認証 | API キー | ADC / Bearer トークン / 一部サービスアカウント連携 |
| 向いている用途 | 個人開発、学習、試作、デモ | 本番運用、チーム開発、企業利用 |
| 権限管理 | シンプル | IAM で細かく管理可能 |
| 監査・ログ | シンプル寄り | Cloud Audit Logs や request-response logging が利用可能 |
| セキュリティ境界 | 軽量 | VPC Service Controls などが使える |
| 注意点 | 大規模運用には弱い | 初期設定が少し重い |


小規模な個人開発や試用であればAI Studio経由で、大規模アプリや本番環境での利用であればVertex AIからの実行が推奨されます。\
開発者はユースケースに合わせてこれらのAPIを使い分け、より良い価値を提供するアプリ開発を進めることが可能です。

## 参考文献
- [Google AI for Developpers](https://ai.google.dev/gemini-api/docs?hl=ja#rest)
- [Google Cloud](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/code-execution?hl=ja#googlegenaisdk_tools_code_exec_with_txt-drest)