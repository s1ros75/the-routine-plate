cat > README.md << 'READMEEOF'
# 🍽️ The Routine Plate

日々の食事プランニングと栄養管理（特に高タンパク・低塩分）をルーチン化するための個人向けWebアプリケーション。

## ✨ 主な機能

- 📅 **週間カレンダー**：月〜日の朝・昼・晩を一目で管理
- 🍳 **レシピ提案機能**：選んだ食材から該当する定番レシピを自動提案
- 📊 **栄養素計算**：100g単位の食材データから自動計算
- 🎯 **目標達成度の可視化**：プログレスバーで一目で確認
- 📈 **週間サマリー**：1週間の食生活を集計表示

## 🛠️ 技術スタック

- **Frontend**: React 18 (Vite) + Tailwind CSS + axios
- **Backend**: Ruby on Rails 7.2 (APIモード) + Service Object パターン
- **Database**: PostgreSQL 16
- **Infrastructure**: Docker / Docker Compose

## 📦 セットアップ

```bash
