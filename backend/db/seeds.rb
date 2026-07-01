# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# ゲストユーザー（認証実装前の仮アカウント）
User.find_or_create_guest!
puts "  seeded: guest user (guest@example.com)"

# 食材マスタ（100gあたりの栄養素）
# 出典: 日本食品標準成分表2020年版（八訂）に基づく概算値
# sodium_per_100g は食塩相当量 (g) = ナトリウム(mg) × 2.54 / 1000
ingredients = [
  # ── タンパク質源（肉類） ─────────────────────────────
  {
    name:                  "鶏むね肉（皮なし）",
    protein_per_100g:      23.3,
    fat_per_100g:           1.9,
    carbohydrate_per_100g:  0.0,
    sodium_per_100g:        0.1,
    calories_per_100g:    116.0,
  },
  {
    name:                  "鶏もも肉（皮なし）",
    protein_per_100g:      19.0,
    fat_per_100g:           5.0,
    carbohydrate_per_100g:  0.0,
    sodium_per_100g:        0.2,
    calories_per_100g:    127.0,
  },
  # ── タンパク質源（魚介類） ───────────────────────────
  {
    name:                  "サーモン（生）",
    protein_per_100g:      20.1,
    fat_per_100g:          11.1,
    carbohydrate_per_100g:  0.1,
    sodium_per_100g:        0.1,
    calories_per_100g:    182.0,
  },
  {
    name:                  "まぐろ赤身（生）",
    protein_per_100g:      26.4,
    fat_per_100g:           1.4,
    carbohydrate_per_100g:  0.1,
    sodium_per_100g:        0.1,
    calories_per_100g:    125.0,
  },
  # ── タンパク質源（卵・乳製品） ───────────────────────
  {
    name:                  "卵（全卵）",
    protein_per_100g:      12.2,
    fat_per_100g:          10.2,
    carbohydrate_per_100g:  0.4,
    sodium_per_100g:        0.1,
    calories_per_100g:    151.0,
  },
  {
    name:                  "ギリシャヨーグルト（無糖）",
    protein_per_100g:      10.0,
    fat_per_100g:           0.3,
    carbohydrate_per_100g:  4.0,
    sodium_per_100g:        0.1,
    calories_per_100g:     60.0,
  },
  # ── タンパク質源（大豆製品） ─────────────────────────
  {
    name:                  "納豆",
    protein_per_100g:      16.5,
    fat_per_100g:          10.0,
    carbohydrate_per_100g: 12.1,
    sodium_per_100g:        0.0,
    calories_per_100g:    200.0,
  },
  {
    name:                  "木綿豆腐",
    protein_per_100g:       7.0,
    fat_per_100g:           4.9,
    carbohydrate_per_100g:  1.5,
    sodium_per_100g:        0.0,
    calories_per_100g:     80.0,
  },
  # ── 主食 ─────────────────────────────────────────────
  {
    name:                  "白米（炊飯後）",
    protein_per_100g:       2.5,
    fat_per_100g:           0.3,
    carbohydrate_per_100g: 37.1,
    sodium_per_100g:        0.0,
    calories_per_100g:    168.0,
  },
  {
    name:                  "玄米（炊飯後）",
    protein_per_100g:       2.8,
    fat_per_100g:           1.0,
    carbohydrate_per_100g: 35.6,
    sodium_per_100g:        0.0,
    calories_per_100g:    165.0,
  },
  # ── 副菜・野菜 ───────────────────────────────────────
  {
    name:                  "ブロッコリー（茹で）",
    protein_per_100g:       3.9,
    fat_per_100g:           0.4,
    carbohydrate_per_100g:  4.3,
    sodium_per_100g:        0.0,
    calories_per_100g:     30.0,
  },
  {
    name:                  "ほうれん草（茹で）",
    protein_per_100g:       2.6,
    fat_per_100g:           0.5,
    carbohydrate_per_100g:  3.6,
    sodium_per_100g:        0.0,
    calories_per_100g:     25.0,
  },
  {
    name:                  "アボカド",
    protein_per_100g:       2.1,
    fat_per_100g:          17.5,
    carbohydrate_per_100g:  7.9,
    sodium_per_100g:        0.0,
    calories_per_100g:    187.0,
  },
  {
    name:                  "さつまいも（蒸し）",
    protein_per_100g:       1.2,
    fat_per_100g:           0.2,
    carbohydrate_per_100g: 32.5,
    sodium_per_100g:        0.0,
    calories_per_100g:    132.0,
  },
  {
    name:                  "キャベツ（生）",
    protein_per_100g:       1.3,
    fat_per_100g:           0.2,
    carbohydrate_per_100g:  5.2,
    sodium_per_100g:        0.0,
    calories_per_100g:     23.0,
  },
]

ingredients.each do |attrs|
  Ingredient.find_or_create_by!(name: attrs[:name]) do |ing|
    ing.assign_attributes(attrs.except(:name))
  end
  puts "  seeded: #{attrs[:name]}"
end

puts "Done. #{Ingredient.count} ingredients in DB."

# ────────────────────────────────────────────────────────────
# レシピマスタ（定番20件）
# ────────────────────────────────────────────────────────────
# 食材名ヘルパー（seeds内で繰り返し使うので短縮定義）
ING = ->(name) { Ingredient.find_by!(name:) }

recipes_data = [
  {
    name:                  "鶏むね肉のグリル定食",
    description:           "高タンパクでさっぱりとした定番グリル定食",
    meal_type:             :dinner,
    cooking_time_minutes:  20,
    difficulty:            :easy,
    instructions:          "鶏むね肉を薄切りにし、塩こしょうで下味をつける\nフライパンに油をひき、中火で両面各4分焼く\nブロッコリーを塩茹でして添え、白米と盛り付ける",
    tags:                  "高タンパク,低塩分",
    ingredients: [
      { name: "鶏むね肉（皮なし）",   amount_g: 150 },
      { name: "ブロッコリー（茹で）", amount_g:  80 },
      { name: "白米（炊飯後）",       amount_g: 150 },
    ],
  },
  {
    name:                  "サーモンと玄米の塩レモンプレート",
    description:           "良質な脂質とタンパク質をバランスよく摂れる一皿",
    meal_type:             :lunch,
    cooking_time_minutes:  25,
    difficulty:            :normal,
    instructions:          "サーモンに塩こしょうとレモン汁をふり10分置く\nフライパンで中火、両面3〜4分ずつ焼く\nブロッコリーを茹で、アボカドをスライスして玄米と盛り付ける",
    tags:                  "高タンパク,オメガ3",
    ingredients: [
      { name: "サーモン（生）",       amount_g: 120 },
      { name: "玄米（炊飯後）",       amount_g: 150 },
      { name: "ブロッコリー（茹で）", amount_g:  80 },
      { name: "アボカド",             amount_g:  50 },
    ],
  },
  {
    name:                  "鶏もも肉の照り焼き丼",
    description:           "甘辛タレが食欲をそそる人気の照り焼き丼",
    meal_type:             :lunch,
    cooking_time_minutes:  20,
    difficulty:            :easy,
    instructions:          "鶏もも肉を一口大に切り、フライパンで皮目から焼く\n醤油・みりん・砂糖を加えて照り焼きに仕上げる\n白米の上に乗せ、千切りキャベツを添える",
    tags:                  "高タンパク,作り置き可",
    ingredients: [
      { name: "鶏もも肉（皮なし）", amount_g: 150 },
      { name: "白米（炊飯後）",     amount_g: 200 },
      { name: "キャベツ（生）",     amount_g:  50 },
    ],
  },
  {
    name:                  "高タンパク朝食ボウル",
    description:           "発酵食品の組み合わせで腸活にも効果的な朝食",
    meal_type:             :breakfast,
    cooking_time_minutes:   5,
    difficulty:            :easy,
    instructions:          "ギリシャヨーグルトを器に盛る\n納豆をよく混ぜてのせる\n好みではちみつや季節の果物を添えて完成",
    tags:                  "高タンパク,低塩分,腸活",
    ingredients: [
      { name: "ギリシャヨーグルト（無糖）", amount_g: 150 },
      { name: "納豆",                       amount_g:  45 },
    ],
  },
  {
    name:                  "シンプル鶏むね肉と玄米",
    description:           "最少の手間で高タンパク・低脂質を実現する定番コンビ",
    meal_type:             :lunch,
    cooking_time_minutes:  15,
    difficulty:            :easy,
    instructions:          "鶏むね肉をラップに包み電子レンジ600Wで5分蒸す\n粗熱を取って薄切りにし、塩こしょうで味を調える\n炊いた玄米と盛り付けて完成",
    tags:                  "高タンパク,低脂質,低塩分",
    ingredients: [
      { name: "鶏むね肉（皮なし）", amount_g: 120 },
      { name: "玄米（炊飯後）",     amount_g: 150 },
    ],
  },
  {
    name:                  "まぐろの漬け丼",
    description:           "赤身まぐろの旨味が引き立つシンプルな漬け丼",
    meal_type:             :lunch,
    cooking_time_minutes:  10,
    difficulty:            :easy,
    instructions:          "醤油・みりんを合わせてたれを作る\nまぐろを一口大に切り、たれに10分漬ける\n白米に盛り付け、わさびを添えて完成",
    tags:                  "高タンパク,低脂質",
    ingredients: [
      { name: "まぐろ赤身（生）", amount_g: 100 },
      { name: "白米（炊飯後）",   amount_g: 180 },
    ],
  },
  {
    name:                  "木綿豆腐とほうれん草の和え物",
    description:           "鉄分・カルシウムが豊富な低カロリーの副菜",
    meal_type:             :lunch,
    cooking_time_minutes:  10,
    difficulty:            :easy,
    instructions:          "ほうれん草を茹でて水気を絞り、3cm長さに切る\n豆腐をちぎって加え、ごまと醤油で和える\n皿に盛り付けて完成",
    tags:                  "低カロリー,低塩分,鉄分豊富",
    ingredients: [
      { name: "木綿豆腐",           amount_g: 150 },
      { name: "ほうれん草（茹で）", amount_g: 100 },
    ],
  },
  {
    name:                  "卵かけご飯と納豆",
    description:           "朝のタンパク質補給に最適な定番の和朝食",
    meal_type:             :breakfast,
    cooking_time_minutes:   5,
    difficulty:            :easy,
    instructions:          "白米を器に盛り、卵を割り落とす\n醤油をたらしてよく混ぜる\n納豆をよく混ぜて横に添えて完成",
    tags:                  "高タンパク,腸活",
    ingredients: [
      { name: "卵（全卵）",   amount_g:  60 },
      { name: "白米（炊飯後）", amount_g: 180 },
      { name: "納豆",         amount_g:  45 },
    ],
  },
  {
    name:                  "アボカドサーモン丼",
    description:           "オメガ3脂肪酸たっぷりの栄養バランス丼",
    meal_type:             :lunch,
    cooking_time_minutes:  15,
    difficulty:            :easy,
    instructions:          "サーモンを一口大に切り、醤油・ごま油で和える\nアボカドを食べやすくスライスする\n白米の上に並べ、ごまを散らして完成",
    tags:                  "高タンパク,オメガ3",
    ingredients: [
      { name: "サーモン（生）", amount_g: 100 },
      { name: "アボカド",       amount_g:  60 },
      { name: "白米（炊飯後）", amount_g: 180 },
    ],
  },
  {
    name:                  "蒸し鶏のサラダプレート",
    description:           "低脂質な蒸し鶏をたっぷりの野菜と合わせたヘルシープレート",
    meal_type:             :lunch,
    cooking_time_minutes:  25,
    difficulty:            :normal,
    instructions:          "鶏むね肉をラップに包み、電子レンジ600Wで5分蒸す\n粗熱が取れたらほぐし、千切りキャベツの上に乗せる\nブロッコリーを茹でて添え、ポン酢でいただく",
    tags:                  "高タンパク,低脂質,低カロリー",
    ingredients: [
      { name: "鶏むね肉（皮なし）",   amount_g: 130 },
      { name: "キャベツ（生）",       amount_g:  80 },
      { name: "ブロッコリー（茹で）", amount_g:  60 },
    ],
  },
  {
    name:                  "さつまいもと鶏もも肉のグリル",
    description:           "食物繊維豊富なさつまいもとタンパク質を同時に補給",
    meal_type:             :dinner,
    cooking_time_minutes:  30,
    difficulty:            :normal,
    instructions:          "さつまいもを1cm輪切りにしてレンジ500Wで3分加熱する\n鶏もも肉と一緒にオーブントースターで15分焼く\nほうれん草を茹でて添えて完成",
    tags:                  "高タンパク,食物繊維",
    ingredients: [
      { name: "鶏もも肉（皮なし）",   amount_g: 150 },
      { name: "さつまいも（蒸し）",   amount_g: 100 },
      { name: "ほうれん草（茹で）",   amount_g:  50 },
    ],
  },
  {
    name:                  "プロテインヨーグルトボウル",
    description:           "手間ゼロで高タンパクな間食・朝食の定番",
    meal_type:             :breakfast,
    cooking_time_minutes:   3,
    difficulty:            :easy,
    instructions:          "ギリシャヨーグルトを器に盛る\n好みのフルーツや蜂蜜をトッピングして完成",
    tags:                  "高タンパク,低塩分,手軽",
    ingredients: [
      { name: "ギリシャヨーグルト（無糖）", amount_g: 200 },
    ],
  },
  {
    name:                  "豆腐とまぐろの冷やしプレート",
    description:           "低塩分・高タンパクの夏向けさっぱりプレート",
    meal_type:             :lunch,
    cooking_time_minutes:  10,
    difficulty:            :easy,
    instructions:          "豆腐を水切りして食べやすく切る\nまぐろをスライスして豆腐の隣に盛り付ける\nポン酢と薬味（大葉・ねぎ）で食べる",
    tags:                  "高タンパク,低塩分,低カロリー",
    ingredients: [
      { name: "木綿豆腐",         amount_g: 150 },
      { name: "まぐろ赤身（生）", amount_g:  80 },
    ],
  },
  {
    name:                  "玄米納豆ボウル",
    description:           "発酵食品と食物繊維で腸内環境を整える朝食",
    meal_type:             :breakfast,
    cooking_time_minutes:   5,
    difficulty:            :easy,
    instructions:          "玄米を炊いて器に盛る\n卵をよく混ぜて玄米に乗せる\n納豆を混ぜてのせ、醤油少々で調味して完成",
    tags:                  "高タンパク,腸活,食物繊維",
    ingredients: [
      { name: "玄米（炊飯後）", amount_g: 150 },
      { name: "納豆",           amount_g:  45 },
      { name: "卵（全卵）",     amount_g:  60 },
    ],
  },
  {
    name:                  "鶏むね肉のヘルシーステーキ",
    description:           "低脂質な鶏むね肉をボリューム感たっぷりに仕上げた晩ご飯",
    meal_type:             :dinner,
    cooking_time_minutes:  20,
    difficulty:            :normal,
    instructions:          "鶏むね肉を厚さ1.5cmにスライスし、フォークで穴を開ける\n塩こしょう・にんにくで下味をつけて10分置く\nフライパンで強めの中火で両面焼き、ブロッコリーとアボカドを添える",
    tags:                  "高タンパク,低脂質",
    ingredients: [
      { name: "鶏むね肉（皮なし）",   amount_g: 180 },
      { name: "ブロッコリー（茹で）", amount_g: 100 },
      { name: "アボカド",             amount_g:  40 },
    ],
  },
  {
    name:                  "サーモンと豆腐のヘルシー定食",
    description:           "タンパク質の種類を組み合わせた栄養バランス定食",
    meal_type:             :dinner,
    cooking_time_minutes:  25,
    difficulty:            :normal,
    instructions:          "サーモンに塩こしょうをふり、フライパンでソテーする（各面3分）\nほうれん草を茹でて添える\n豆腐をレンジで温め、白米と共に盛り付ける",
    tags:                  "高タンパク,オメガ3",
    ingredients: [
      { name: "サーモン（生）",       amount_g: 120 },
      { name: "木綿豆腐",             amount_g: 100 },
      { name: "ほうれん草（茹で）",   amount_g:  80 },
      { name: "白米（炊飯後）",       amount_g: 150 },
    ],
  },
  {
    name:                  "たまごとほうれん草のスクランブル",
    description:           "鉄分・ビタミン補給に最適な栄養満点の朝食",
    meal_type:             :breakfast,
    cooking_time_minutes:   8,
    difficulty:            :easy,
    instructions:          "卵を溶いて塩こしょうで味付けする\nほうれん草を茹でて水気を切り、3cm長さに切る\nフライパンにバターを溶かし、卵とほうれん草を炒め合わせる",
    tags:                  "高タンパク,鉄分豊富",
    ingredients: [
      { name: "卵（全卵）",         amount_g: 100 },
      { name: "ほうれん草（茹で）", amount_g:  60 },
    ],
  },
  {
    name:                  "キャベツと鶏もも肉の蒸し料理",
    description:           "ビタミンCたっぷりのキャベツと鶏肉を蒸し焼きにした低脂質メニュー",
    meal_type:             :dinner,
    cooking_time_minutes:  25,
    difficulty:            :normal,
    instructions:          "キャベツをざく切りにし、鶏もも肉を一口大に切る\nフライパンに並べ、酒と水を少量加えてふたをして蒸し焼き（中火15分）\nポン酢または塩レモンで味付けして完成",
    tags:                  "低カロリー,作り置き可",
    ingredients: [
      { name: "鶏もも肉（皮なし）", amount_g: 150 },
      { name: "キャベツ（生）",     amount_g: 150 },
    ],
  },
  {
    name:                  "さつまいもとヨーグルトの朝食",
    description:           "食物繊維と乳タンパクで腹持ちの良い朝食コンビ",
    meal_type:             :breakfast,
    cooking_time_minutes:   8,
    difficulty:            :easy,
    instructions:          "さつまいもをレンジ500Wで5分加熱する\n粗熱を取り、食べやすい大きさに切る\nギリシャヨーグルトを添えて完成",
    tags:                  "食物繊維,腸活,手軽",
    ingredients: [
      { name: "さつまいも（蒸し）",       amount_g: 120 },
      { name: "ギリシャヨーグルト（無糖）", amount_g: 100 },
    ],
  },
  {
    name:                  "まぐろとアボカドの丼",
    description:           "良質な脂質とタンパク質を一度に摂れる人気の丼",
    meal_type:             :lunch,
    cooking_time_minutes:  10,
    difficulty:            :easy,
    instructions:          "まぐろを一口大に切り、醤油・ごま油で和える\nアボカドをダイスカットする\n白米の上に盛り付け、ごまをかけて完成",
    tags:                  "高タンパク,オメガ3",
    ingredients: [
      { name: "まぐろ赤身（生）", amount_g: 100 },
      { name: "アボカド",         amount_g:  60 },
      { name: "白米（炊飯後）",   amount_g: 180 },
    ],
  },
]

recipes_data.each do |attrs|
  recipe = Recipe.find_or_create_by!(name: attrs[:name]) do |r|
    r.description          = attrs[:description]
    r.meal_type            = attrs[:meal_type]
    r.cooking_time_minutes = attrs[:cooking_time_minutes]
    r.difficulty           = attrs[:difficulty]
    r.instructions         = attrs[:instructions]
    r.tags                 = attrs[:tags]
  end

  attrs[:ingredients].each do |ing_attrs|
    ingredient = ING.(ing_attrs[:name])
    RecipeIngredient.find_or_create_by!(recipe: recipe, ingredient: ingredient) do |ri|
      ri.amount_g = ing_attrs[:amount_g]
    end
  end

  puts "  seeded recipe: #{attrs[:name]}"
end

puts "Done. #{Recipe.count} recipes / #{RecipeIngredient.count} recipe_ingredients in DB."
