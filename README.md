# The Routine Plate

![CI](https://github.com/s1ros75/the-routine-plate/actions/workflows/ci.yml/badge.svg)

日々の食事プランニングと栄養管理（特に高タンパク・低塩分）をルーチン化するための個人向けWebアプリケーション。

選んだ食材から該当する定番レシピを自動提案し、栄養素計算・週間サマリーまで一貫して管理できます。

## 開発背景

健康的な食事を続けるには、毎日「何を作るか」「栄養バランスは取れているか」を考える必要があります。
特に高タンパク・低塩分を意識した食生活は、計画と記録が習慣化のカギ。
このアプリは、その判断と記録を最小の操作でルーチン化することを目的に開発しました。

## 主な機能

### ダッシュボード
- 1週間メニューカレンダー（月〜日 × 朝・昼・晩のグリッド）
- 週間サマリー（総タンパク質・1日平均タンパク質・1日平均塩分）
- 達成度バッジ（目標達成率に応じて自動切替）
- 登録食材一覧（検索・ソート機能付き）
- 栄養計算デモ（任意の食材組み合わせから栄養素を即時計算）

### 食事登録（4ステップモーダル）
1. 食材選択: チェックボックスで複数選択、選択中はチップ表示
2. レシピ提案: 選んだ食材を全て含む定番レシピを自動検索・カード表示
3. 確認: メニュー名の編集、栄養素プレビュー
4. 保存: ワンクリックでDBに永続化

レシピ候補が見つからない場合は「自由入力モード」へフォールバック可能。

### 栄養計算ロジック
- 食材ごとに100gあたりの栄養データを保持
- 使用量(g)に応じて自動按分計算
- Service Object パターンで責務を分離（NutritionCalculator）

## 技術スタック

### Frontend
- React 18 (Vite)
- Tailwind CSS
- axios
- lucide-react
- TypeScript 5.x（strict mode）

### Backend
- Ruby 3.3
- Ruby on Rails 7.2 (APIモード)
- PostgreSQL 16
- Puma 8.0
- rack-cors

### Infrastructure
- Docker / Docker Compose
- Alpine Linux ベースイメージ

## セットアップ

### 前提条件
- Docker Desktop がインストール済み
- 8GB以上の空きメモリ推奨

### 手順

1. リポジトリをクローン

    git clone https://github.com/s1ros75/the-routine-plate.git
    cd the-routine-plate

2. master.key を新規生成（初回のみ）

    docker-compose run --rm backend bundle exec rails credentials:edit

    エディタが開いたら、そのまま保存して閉じる（master.key が自動生成される）

3. Dockerコンテナをビルド・起動

    docker-compose up -d

4. データベース作成・マイグレーション・シード投入

    docker-compose exec backend bundle exec rails db:create db:migrate db:seed

5. ブラウザでアクセス
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## データモデル

主要な7つのテーブルで構成。

| テーブル | 説明 |
|---------|------|
| users | ユーザー情報 |
| meals | ユーザーが登録した食事記録 |
| ingredients | 食材マスター（100g単位の栄養データ含む） |
| meal_ingredients | 食事と食材の中間テーブル（使用量を保持） |
| routines | 曜日×食事タイプの定期割当 |
| recipes | 定番レシピ集 |
| recipe_ingredients | レシピと食材の中間テーブル |

## API エンドポイント

| Method | Path | 説明 |
|--------|------|------|
| GET | /api/v1/ingredients | 食材一覧 |
| POST | /api/v1/ingredients | 食材新規登録 |
| GET | /api/v1/recipes | レシピ一覧（栄養素計算込み） |
| GET | /api/v1/recipes/:id | レシピ詳細 |
| POST | /api/v1/recipes/search | 食材IDから該当レシピを検索 |
| GET | /api/v1/meals | 食事一覧 |
| POST | /api/v1/meals | 食事登録 |
| POST | /api/v1/meals/calculate | 任意の食材組み合わせから栄養素計算 |
| GET | /api/v1/meals/weekly_summary | 週間サマリー集計 |

### リクエスト例

レシピ検索:

    POST /api/v1/recipes/search
    Content-Type: application/json

    { "ingredient_ids": [1, 11, 9] }

レスポンス例:

    {
      "matched_recipes": [
        {
          "id": 1,
          "name": "鶏むね肉のグリル定食",
          "cooking_time_minutes": 20,
          "difficulty": "easy",
          "nutrition": {
            "protein_g": 41.82,
            "sodium_g": 0.15,
            "calories_kcal": 450.0
          }
        }
      ],
      "count": 1
    }

## シードデータ

### 食材 15品目
高タンパク・低塩分を意識した実用的なラインナップ。日本食品標準成分表をベースに作成。

- 主菜系: 鶏むね肉、鶏もも肉、サーモン、まぐろ赤身、卵、納豆、木綿豆腐、ギリシャヨーグルト
- 主食系: 白米、玄米
- 副菜系: ブロッコリー、ほうれん草、アボカド、さつまいも、キャベツ

### 定番レシピ 20件
朝・昼・晩・間食をカバー。各レシピに調理時間・難易度・作り方手順・タグを含む。

例: 鶏むね肉のグリル定食、サーモンと玄米の塩レモンプレート、高タンパク朝食ボウル、まぐろの漬け丼、玄米納豆ボウル など

## プロジェクト構造

    the-routine-plate/
    ├── backend/                    # Rails 7.2 API
    │   ├── app/
    │   │   ├── controllers/api/v1/  # APIコントローラー
    │   │   ├── models/              # 7つのモデル
    │   │   └── services/            # NutritionCalculator, MealCreatorService
    │   ├── config/
    │   └── db/
    │       ├── migrate/             # 7つのマイグレーション
    │       └── seeds.rb             # 食材15品目 + レシピ20件
    │
    ├── frontend/                   # React 18 + Vite
    │   └── src/
    │       ├── api/                 # APIクライアント
    │       ├── components/
    │       │   ├── dashboard/       # ダッシュボード関連
    │       │   ├── nutrition/       # 栄養素表示
    │       │   └── ui/              # 共通UI
    │       ├── hooks/               # カスタムフック
    │       └── data/                # 定数
    │
    ├── docker-compose.yml
    └── README.md

## 設計のこだわり

### バックエンド
- Service Object パターン: 栄養計算ロジックをモデルから分離（NutritionCalculator）
- Data.define による値オブジェクト: 計算結果の型安全性を確保
- N+1問題の回避: includes で関連テーブルを事前読み込み
- 冪等なシード: find_or_create_by で複数回実行可能

### フロントエンド
- コンポーネント分割: 機能別にディレクトリを分け、再利用性を重視
- カスタムフック: useIngredients, useRecipeSearch, useWeeklySummary で状態管理を集約
- 段階的UI: 4ステップモーダルで複雑な登録フローを直感的に
- レスポンシブ対応: Tailwindのブレイクポイントで自動調整

## 開発を通じて学んだこと

- Docker環境構築でのトラブルシューティング（Alpine vs Debian, ネイティブ拡張ビルド, プラットフォーム差異）
- Rails APIモードでのRESTful API設計
- React Hooksパターンでの状態管理
- Service Object と値オブジェクトによる責務分離
- CORS設定、Rack middleware の理解

## ライセンス

## 今後の改善予定

- [x] TypeScript への移行（strict mode）
- [ ] ESLint / Prettier の導入
- [ ] Vitest によるテスト（カバレッジ80%以上）
- [ ] アクセシビリティ対応（WCAG 2.1 AA準拠）
- [ ] Vercel + Fly.io へのデプロイ
