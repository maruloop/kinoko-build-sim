
export interface Skill {
  id: number;
  name: string;
  icon: string;
}

export const skills: Skill[] = [
  { id: 1, name: '胞子爆弾', icon: 'icons/skills/1.jpg' },
  { id: 2, name: '菌茸頭打', icon: 'icons/skills/2.jpg' },
  { id: 3, name: '胞子連撃', icon: 'icons/skills/3.jpg' },
  { id: 4, name: '巨石衝撃', icon: 'icons/skills/4.jpg' },
  { id: 5, name: 'トゲ茂み', icon: 'icons/skills/5.jpg' },
  { id: 6, name: 'キノ先駆', icon: 'icons/skills/6.jpg' },
  { id: 7, name: 'ツタ縛り', icon: 'icons/skills/7.jpg' },
  { id: 8, name: '疾駆菌茸', icon: 'icons/skills/8.jpg' },
  { id: 9, name: '蜘蛛の巣', icon: 'icons/skills/9.jpg' },
  { id: 10, name: '落パイン', icon: 'icons/skills/10.jpg' },
  { id: 11, name: '貝恩返し', icon: 'icons/skills/11.jpg' },
  { id: 12, name: 'ツタ繁茂', icon: 'icons/skills/12.jpg' },
  { id: 13, name: '蝙蝠行方', icon: 'icons/skills/13.jpg' },
  { id: 14, name: '大地回復', icon: 'icons/skills/14.jpg' },
  { id: 15, name: '菌バリア', icon: 'icons/skills/15.jpg' },
  { id: 16, name: 'ドリ爆弾', icon: 'icons/skills/16.jpg' },
  { id: 17, name: '反則打撃', icon: 'icons/skills/17.jpg' },
  { id: 18, name: '速度暖慢', icon: 'icons/skills/18.jpg' },
  { id: 19, name: 'コイン爆弾', icon: 'icons/skills/19.jpg' },
  { id: 20, name: 'スライ弾', icon: 'icons/skills/20.jpg' },
  { id: 21, name: '流星落弾', icon: 'icons/skills/21.jpg' },
  { id: 22, name: '武装解除', icon: 'icons/skills/22.jpg' },
  { id: 23, name: '目眩失神', icon: 'icons/skills/23.jpg' },
  { id: 24, name: '煙幕弾', icon: 'icons/skills/24.jpg' },
  { id: 25, name: '無常狩命', icon: 'icons/skills/25.jpg' },
  { id: 26, name: '英魂降臨', icon: 'icons/skills/26.jpg' },
  { id: 27, name: '狂風通道', icon: 'icons/skills/27.jpg' },
  { id: 28, name: '稲妻奇襲', icon: 'icons/skills/28.jpg' },
  { id: 29, name: '利刃貫通', icon: 'icons/skills/29.jpg' },
  { id: 30, name: '分身攻撃', icon: 'icons/skills/30.jpg' },
  { id: 31, name: '百斬千鎖', icon: 'icons/skills/31.jpg' },
  { id: 32, name: '風神の矢', icon: 'icons/skills/32.jpg' },
  { id: 33, name: '血月降臨', icon: 'icons/skills/33.jpg' },
  { id: 34, name: '竜吟双声', icon: 'icons/skills/34.jpg' },
  { id: 35, name: '天下の罠', icon: 'icons/skills/35.jpg' },
  { id: 36, name: 'タロット星陣', icon: 'icons/skills/36.jpg' },
  { id: 37, name: '鳶蝶入夢', icon: 'icons/skills/37.jpg' },
  { id: 38, name: '祖神の意思', icon: 'icons/skills/38.jpg' }
];

export interface Pal {
  id: number;
  name: string;
  icon: string;
  species: string;
}

export enum Species {
  Dog = '芝犬',
  Bird = '鳥',
  Chicken = '鶏',
  Snail = '蝸牛',
  Slime = '水玉',
  Fairy = '妖精',
  Panda = 'パンダ',
  Deer = '鹿',
  Cat = '猫',
  SnowSpirit = '雪精霊',
  Banana = 'バナナ',
  Toothpaste = '歯磨き粉',
  RoboDragon = 'ロボドラゴン',
  Dragon = '竜',
  Eggplant = 'ナス',
  BDuck = 'B.Duck',
  Nobunagawan = 'ノブナガワン',
  Teriamon = 'テリアモン',
  Renamon = 'レナモン',
  Shuuko = 'シュー子ちゃん',
  GingerCookie = 'ジンジャークッキー',
  BrokenHeartFrog = '傷心蛙',
  MeikaYuu = '冥火幽羽',
  FloppyPuppy = 'バタバタ子犬',
  PirateParrot = '海賊オウム',
  Gerotan = 'ゲロタン',
  Dangoron = 'ダンゴロン',
  MoonRabbit = '月の兎',
  Turtle = 'カメ',
  RoboDog = 'ロボドッグ',
  Fox = '狐',
  Octopus = 'タコ',
  Lizard = 'トカゲ',
  Alpaca = 'アルパカ'
}

export const pals: Pal[] = [
  { id: 1, name: '卵割り小鶏', species: Species.Chicken, icon: 'icons/pals/1.jpg' },
  { id: 2, name: 'キノコ鳥', species: Species.Bird, icon: 'icons/pals/2.jpg' },
  { id: 3, name: 'デンデン虫', species: Species.Snail, icon: 'icons/pals/3.jpg' },
  { id: 4, name: '水玉', species: Species.Slime, icon: 'icons/pals/4.jpg' },
  { id: 5, name: '飛行狐', species: Species.Fairy, icon: 'icons/pals/5.jpg' },
  { id: 6, name: 'パンダ', species: Species.Panda, icon: 'icons/pals/6.jpg' },
  { id: 7, name: '子鹿', species: Species.Deer, icon: 'icons/pals/7.jpg' },
  { id: 8, name: '子猫', species: Species.Cat, icon: 'icons/pals/8.jpg' },
  { id: 9, name: '雪布颠', species: Species.SnowSpirit, icon: 'icons/pals/9.jpg' },
  { id: 10, name: '豆柴', species: Species.Dog, icon: 'icons/pals/10.jpg' },
  { id: 11, name: '聖夜火鶏', species: Species.Chicken, icon: 'icons/pals/11.jpg' },
  { id: 12, name: 'アマヤ鳥', species: Species.Bird, icon: 'icons/pals/12.jpg' },
  { id: 13, name: '棘デンデン虫', species: Species.Snail, icon: 'icons/pals/13.jpg' },
  { id: 14, name: '反逆バナナ', species: Species.Banana, icon: 'icons/pals/14.jpg' },
  { id: 15, name: '黒猫', species: Species.Cat, icon: 'icons/pals/15.jpg' },
  { id: 16, name: '自然の精霊', species: Species.Slime, icon: 'icons/pals/16.jpg' },
  { id: 17, name: 'アミちゃん', species: Species.Fairy, icon: 'icons/pals/17.jpg' },
  { id: 18, name: '雪団子', species: Species.SnowSpirit, icon: 'icons/pals/18.jpg' },
  { id: 19, name: '柴太郎', species: Species.Dog, icon: 'icons/pals/19.jpg' },
  { id: 20, name: 'パンダ槌', species: Species.Panda, icon: 'icons/pals/20.jpg' },
  { id: 21, name: '枝角鹿', species: Species.Deer, icon: 'icons/pals/21.jpg' },
  { id: 22, name: '潔癖闘士', species: Species.Toothpaste, icon: 'icons/pals/22.jpg' },
  { id: 23, name: '魔女猫', species: Species.Cat, icon: 'icons/pals/23.jpg' },
  { id: 24, name: '好戦な水玉', species: Species.Slime, icon: 'icons/pals/24.jpg' },
  { id: 25, name: 'ボーゴン', species: Species.Fairy, icon: 'icons/pals/25.jpg' },
  { id: 26, name: '雪精霊', species: Species.SnowSpirit, icon: 'icons/pals/26.jpg' },
  { id: 27, name: 'パフェ柴', species: Species.Dog, icon: 'icons/pals/27.jpg' },
  { id: 28, name: '戦闘鶏', species: Species.Chicken, icon: 'icons/pals/28.jpg' },
  { id: 29, name: '青レイ鳥', species: Species.Bird, icon: 'icons/pals/29.jpg' },
  { id: 30, name: '学徒パンダ', species: Species.Panda, icon: 'icons/pals/30.jpg' },
  { id: 31, name: '苔デンデン虫', species: Species.Snail, icon: 'icons/pals/31.jpg' },
  { id: 32, name: '生花鹿', species: Species.Deer, icon: 'icons/pals/32.jpg' },
  { id: 33, name: 'マイ猫', species: Species.Cat, icon: 'icons/pals/33.jpg' },
  { id: 34, name: '常勝水玉', species: Species.Slime, icon: 'icons/pals/34.jpg' },
  { id: 35, name: '貫通獣', species: Species.Fairy, icon: 'icons/pals/35.jpg' },
  { id: 36, name: '雪妖怪', species: Species.SnowSpirit, icon: 'icons/pals/36.jpg' },
  { id: 37, name: 'メカ柴', species: Species.Dog, icon: 'icons/pals/37.jpg' },
  { id: 38, name: '功夫神鶏', species: Species.Chicken, icon: 'icons/pals/38.jpg' },
  { id: 39, name: '紅ラン鳥', species: Species.Bird, icon: 'icons/pals/39.jpg' },
  { id: 40, name: '道着パンダ', species: Species.Panda, icon: 'icons/pals/40.jpg' },
  { id: 41, name: 'アイスデン虫', species: Species.Snail, icon: 'icons/pals/41.jpg' },
  { id: 42, name: '霊鹿', species: Species.Deer, icon: 'icons/pals/42.jpg' },
  { id: 43, name: '楊枝ナス', species: Species.Eggplant, icon: 'icons/pals/43.jpg' },
  { id: 44, name: '副龍ポヨン', species: Species.Dragon, icon: 'icons/pals/44.jpg' },
  { id: 45, name: 'ロボドラゴン', species: Species.RoboDragon, icon: 'icons/pals/45.jpg' },
  { id: 46, name: 'B.Duck', species: Species.BDuck, icon: 'icons/pals/46.jpg' },
  { id: 47, name: 'ノブナガワン', species: Species.Nobunagawan, icon: 'icons/pals/47.jpg' },
  { id: 48, name: 'テリアモン', species: Species.Teriamon, icon: 'icons/pals/48.jpg' },
  { id: 49, name: 'レナモン', species: Species.Renamon, icon: 'icons/pals/49.jpg' },
  { id: 50, name: 'シュー子ちゃん', species: Species.Shuuko, icon: 'icons/pals/50.jpg' },
  { id: 51, name: 'ゲロタン', species: Species.Gerotan, icon: 'icons/pals/51.jpg' },
  { id: 52, name: 'ダンゴロン', species: Species.Dangoron, icon: 'icons/pals/52.jpg' },
  { id: 53, name: '王子猫', species: Species.Cat, icon: 'icons/pals/53.jpg' },
  { id: 54, name: '戦神水玉', species: Species.Slime, icon: 'icons/pals/54.jpg' },
  { id: 55, name: '火尾', species: Species.Fairy, icon: 'icons/pals/55.jpg' },
  { id: 56, name: '雪大将', species: Species.SnowSpirit, icon: 'icons/pals/56.jpg' },
  { id: 57, name: '武士柴', species: Species.Dog, icon: 'icons/pals/57.jpg' },
  { id: 58, name: '天下トリ', species: Species.Chicken, icon: 'icons/pals/58.jpg' },
  { id: 59, name: '侠カク鳥', species: Species.Bird, icon: 'icons/pals/59.jpg' },
  { id: 60, name: '武芸パンダ', species: Species.Panda, icon: 'icons/pals/60.jpg' },
  { id: 61, name: '酔デンデン虫', species: Species.Snail, icon: 'icons/pals/61.jpg' },
  { id: 62, name: '天使鹿', species: Species.Deer, icon: 'icons/pals/62.jpg' },
  { id: 63, name: '正義バナナ', species: Species.Banana, icon: 'icons/pals/63.jpg' },
  { id: 64, name: '虹守護者', species: Species.Toothpaste, icon: 'icons/pals/64.jpg' },
  { id: 65, name: '傷心蛙', species: Species.BrokenHeartFrog, icon: 'icons/pals/65.jpg' },
  { id: 66, name: '冥火幽羽', species: Species.MeikaYuu, icon: 'icons/pals/66.jpg' },
  { id: 67, name: 'バタバタ子犬', species: Species.FloppyPuppy, icon: 'icons/pals/67.jpg' },
  { id: 68, name: '海賊オウム', species: Species.PirateParrot, icon: 'icons/pals/68.jpg' },
  { id: 69, name: 'ジンジャークッキー', species: Species.GingerCookie, icon: 'icons/pals/69.jpg' },
  { id: 70, name: '隠宝竜', species: Species.Dragon, icon: 'icons/pals/70.jpg' },
  { id: 71, name: 'クールカメ', species: Species.Turtle, icon: 'icons/pals/71.jpg' },
  { id: 72, name: 'ロボドッグ', species: Species.RoboDog, icon: 'icons/pals/72.jpg' },
  { id: 73, name: '狐山神狐', species: Species.Fox, icon: 'icons/pals/73.jpg' },
  { id: 74, name: '海賊タコ', species: Species.Octopus, icon: 'icons/pals/74.jpg' },
  { id: 75, name: '富豪トカゲ', species: Species.Lizard, icon: 'icons/pals/75.jpg' },
  { id: 76, name: '月の兎', species: Species.MoonRabbit, icon: 'icons/pals/76.jpg' },
  { id: 77, name: '駝鈴カラン', species: Species.Alpaca, icon: 'icons/pals/77.jpg' },
]