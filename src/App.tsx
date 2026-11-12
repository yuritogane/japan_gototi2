import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Timer, Trophy, ArrowLeft, ArrowRight, RotateCcw, Play } from 'lucide-react';
import './App.css';

// 100種類の日本ご当地クイズデータベース
const QUIZ_DATABASE = [
  { id: 1, question: "阿波踊りで有名なのはどちらの県？", left: "愛媛県", right: "徳島県", correct: "right", category: "祭り・伝統" },
  { id: 2, question: "天守が「国宝」に指定されている城はどちら？", left: "姫路城", right: "大阪城", correct: "left", category: "史跡・城" },
  { id: 3, question: "「日本三景」の一つ、天橋立がある都道府県は？", left: "京都府", right: "宮城県", correct: "left", category: "名所" },
  { id: 4, question: "日本一高い山「富士山」がまたがるのは静岡県とどこ？", left: "長野県", right: "山梨県", correct: "right", category: "自然・名所" },
  { id: 5, question: "草津温泉がある都道府県は？", left: "群馬県", right: "栃木県", correct: "left", category: "温泉・観光" },
  { id: 6, question: "「道後温泉」がある都道府県は？", left: "愛媛県", right: "香川県", correct: "left", category: "温泉・観光" },
  { id: 7, question: "さっぽろ雪まつりが開催される北海道の都市は？", left: "札幌市", right: "函館市", correct: "left", category: "祭り・イベント" },
  { id: 8, question: "厳島神社の大鳥居がある都道府県は？", left: "山口県", right: "広島県", correct: "right", category: "世界遺産" },
  { id: 9, question: "「兼六園」がある都市はどちら？", left: "金沢市", right: "岡山市", correct: "left", category: "庭園・名所" },
  { id: 10, question: "「ねぶた祭」が開催される都道府県は？", left: "秋田県", right: "青森県", correct: "right", category: "祭り・伝統" },
  { id: 11, question: "世界遺産の「白川郷」がある都道府県は？", left: "岐阜県", right: "富山県", correct: "left", category: "世界遺産" },
  { id: 12, question: "出雲大社がある都道府県は？", left: "鳥取県", right: "島根県", correct: "right", category: "神社・仏閣" },
  { id: 13, question: "「日光東照宮」がある都道府県は？", left: "栃木県", right: "茨城県", correct: "left", category: "世界遺産" },
  { id: 14, question: "「首里城公園」がある都道府県は？", left: "鹿児島県", right: "沖縄県", correct: "right", category: "史跡・城" },
  { id: 15, question: "「讃岐うどん」の本場はどちらの県？", left: "香川県", right: "徳島県", correct: "left", category: "グルメ・名物" },
  { id: 16, question: "日本三名園の一つ「後楽園」がある都市は？", left: "水戸市", right: "岡山市", correct: "right", category: "庭園・名所" },
  { id: 17, question: "ひろめ市場や高知城がある県は？", left: "高知県", right: "愛媛県", correct: "left", category: "名所・観光" },
  { id: 18, question: "「ハウステンボス」がある都道府県は？", left: "長崎県", right: "佐賀県", correct: "left", category: "テーマパーク" },
  { id: 19, question: "カルデラで有名な「阿蘇山」がある都道府県は？", left: "熊本県", right: "大分県", correct: "left", category: "自然" },
  { id: 20, question: "「鳥取砂丘」があるのはどちらの都道府県？", left: "島根県", right: "鳥取県", correct: "right", category: "自然・名所" },
  { id: 21, question: "日本最大の湖「琵琶湖」がある都道府県は？", left: "滋賀県", right: "三重県", correct: "left", category: "自然" },
  { id: 22, question: "「伊勢神宮」がある都道府県は？", left: "和歌山県", right: "三重県", correct: "right", category: "神社・仏閣" },
  { id: 23, question: "「信州そば」で知られる長野県の旧国名は？", left: "信濃", right: "越後", correct: "left", category: "歴史・グルメ" },
  { id: 24, question: "仙台の有名な夏祭りは？", left: "七夕まつり", right: "竿燈まつり", correct: "left", category: "祭り" },
  { id: 25, question: "「蔵王の樹氷」が見られる山系がある県は宮城とどこ？", left: "福島県", right: "山形県", correct: "right", category: "自然" },
  { id: 26, question: "国宝・松本城がある都道府県は？", left: "長野県", right: "岐阜県", correct: "left", category: "史跡・城" },
  { id: 27, question: "「白糸の滝」で知られる有名な観光地軽井沢があるのは？", left: "山梨県", right: "長野県", correct: "right", category: "観光名所" },
  { id: 28, question: "日本三銘湯の一つ「有馬温泉」がある都道府県は？", left: "兵庫県", right: "京都府", correct: "left", category: "温泉" },
  { id: 29, question: "「高野山」がある都道府県は？", left: "奈良県", right: "和歌山県", correct: "right", category: "世界遺産" },
  { id: 30, question: "「法隆寺」がある都道府県は？", left: "奈良県", right: "京都府", correct: "left", category: "世界遺産" },
  { id: 31, question: "「天王寺動物園」や通天閣がある都市は？", left: "大阪市", right: "神戸市", correct: "left", category: "観光" },
  { id: 32, question: "「横浜中華街」がある都道府県は？", left: "千葉県", right: "神奈川県", correct: "right", category: "観光・グルメ" },
  { id: 33, question: "成田国際空港がある都道府県は？", left: "東京都", right: "千葉県", correct: "right", category: "交通・名所" },
  { id: 34, question: "「富岡製糸場」がある都道府県は？", left: "群馬県", right: "埼玉県", correct: "left", category: "世界遺産" },
  { id: 35, question: "日本三名園の一つ「偕楽園」がある都市は？", left: "水戸市", right: "宇都宮市", correct: "left", category: "名所" },
  { id: 36, question: "「大洗磯前神社」の神磯の鳥居がある県は？", left: "茨城県", right: "千葉県", correct: "left", category: "神社・絶景" },
  { id: 37, question: "「会津若松城（鶴ヶ城）」がある都道府県は？", left: "福島県", right: "山形県", correct: "left", category: "史跡・城" },
  { id: 38, question: "「角館の武家屋敷」で有名なみちのく小京都がある県は？", left: "秋田県", right: "岩手県", correct: "left", category: "歴史・名所" },
  { id: 39, question: "世界遺産「平泉（中尊寺金色堂）」がある都道府県は？", left: "岩手県", right: "青森県", correct: "left", category: "世界遺産" },
  { id: 40, question: "「奥入瀬渓流」がある都道府県は？", left: "秋田県", right: "青森県", correct: "right", category: "自然" },
  { id: 41, question: "「知床半島」がある都道府県は？", left: "北海道", right: "青森県", correct: "left", category: "世界遺産" },
  { id: 42, question: "「小樽運河」がある都道府県は？", left: "北海道", right: "石川県", correct: "left", category: "名所" },
  { id: 43, question: "「東尋坊」の断崖絶壁がある都道府県は？", left: "福井県", right: "石川県", correct: "left", category: "自然・名所" },
  { id: 44, question: "「立山黒部アルペンルート」がある都道府県は？", left: "富山県", right: "新潟県", correct: "left", category: "自然・観光" },
  { id: 45, question: "「佐渡金山」がある都道府県は？", left: "新潟県", right: "山形県", correct: "left", category: "歴史・世界遺産" },
  { id: 46, question: "「河口湖」から見事な景色が望める山は？", left: "富士山", right: "筑波山", correct: "left", category: "自然" },
  { id: 47, question: "「熱海温泉」がある都道府県は？", left: "静岡県", right: "神奈川県", correct: "left", category: "温泉" },
  { id: 48, question: "「名古屋城」の天守飾りに使われているのは？", left: "金のしゃちほこ", right: "銀の鳳凰", correct: "left", category: "史跡" },
  { id: 49, question: "「飛騨高山」の古い町並みがある都道府県は？", left: "岐阜県", right: "長野県", correct: "left", category: "歴史・観光" },
  { id: 50, question: "「熊野古道」が多く通る和歌山県と三重県、もう一つは？", left: "奈良県", right: "大阪府", correct: "left", category: "世界遺産" },
  { id: 51, question: "「清水寺」の本堂舞台がある都市は？", left: "京都市", right: "奈良市", correct: "left", category: "世界遺産" },
  { id: 52, question: "「竹田城跡」の雲海で有名な「天空の城」がある県は？", left: "兵庫県", right: "岡山県", correct: "left", category: "史跡・名所" },
  { id: 53, question: "「倉敷美観地区」がある都道府県は？", left: "岡山県", right: "広島県", correct: "left", category: "観光" },
  { id: 54, question: "「角島大橋」で美しい海を見られる都道府県は？", left: "山口県", right: "福岡県", correct: "left", category: "絶景" },
  { id: 55, question: "「錦帯橋」という5連の木造橋がある都道府県は？", left: "山口県", right: "島根県", correct: "left", category: "名所・建造物" },
  { id: 56, question: "「祖谷の蔓橋（かずらばし）」がある都道府県は？", left: "徳島県", right: "高知県", correct: "left", category: "名所" },
  { id: 57, question: "「金刀比羅宮（こんぴらさん）」がある都道府県は？", left: "香川県", right: "愛媛県", correct: "left", category: "神社" },
  { id: 58, question: "「太宰府天満宮」がある都道府県は？", left: "福岡県", right: "熊本県", correct: "left", category: "神社" },
  { id: 59, question: "「吉野ヶ里遺跡」がある都道府県は？", left: "佐賀県", right: "長崎県", correct: "left", category: "史跡" },
  { id: 60, question: "「別府温泉」の「地獄めぐり」がある都道府県は？", left: "大分県", right: "熊本県", correct: "left", category: "温泉" },
  { id: 61, question: "「高千穂峡」の神秘的な渓谷がある都道府県は？", left: "宮崎県", right: "鹿児島県", correct: "left", category: "自然" },
  { id: 62, question: "「桜島」がある都道府県は？", left: "鹿児島県", right: "宮崎県", correct: "left", category: "自然" },
  { id: 63, question: "世界自然遺産の「屋久島」がある都道府県は？", left: "鹿児島県", right: "沖縄県", correct: "left", category: "世界遺産" },
  { id: 64, question: "「美ら海水族館」がある都道府県は？", left: "沖縄県", right: "鹿児島県", correct: "left", category: "観光" },
  { id: 65, question: "「日光の華厳の滝」がある都道府県は？", left: "栃木県", right: "群馬県", correct: "left", category: "自然" },
  { id: 66, question: "「東京スカイツリー」の高さは？", left: "634m", right: "333m", correct: "left", category: "ランドマーク" },
  { id: 67, question: "「銀山温泉」のレトロな街並みがある都道府県は？", left: "山形県", right: "秋田県", correct: "left", category: "温泉" },
  { id: 68, question: "「五稜郭」がある北海道の都市は？", left: "函館市", right: "旭川市", correct: "left", category: "史跡" },
  { id: 69, question: "「四万十川」の清流が流れる都道府県は？", left: "高知県", right: "徳島県", correct: "left", category: "自然" },
  { id: 70, question: "「白浜温泉」や円月島がある都道府県は？", left: "和歌山県", right: "兵庫県", correct: "left", category: "温泉・名所" },
  { id: 71, question: "「彦根城」がある都道府県は？", left: "滋賀県", right: "岐阜県", correct: "left", category: "史跡・国宝" },
  { id: 72, question: "「犬山城」がある都道府県は？", left: "愛知県", right: "岐阜県", correct: "left", category: "史跡・国宝" },
  { id: 73, question: "「松江城」がある都道府県は？", left: "島根県", right: "鳥取県", correct: "left", category: "史跡・国宝" },
  { id: 74, question: "「三渓園」がある都市は？", left: "横浜市", right: "鎌倉市", correct: "left", category: "庭園" },
  { id: 75, question: "「高尾山」がある都道府県は？", left: "東京都", right: "神奈川県", correct: "left", category: "自然" },
  { id: 76, question: "「箱根温泉」がある都道府県は？", left: "神奈川県", right: "静岡県", correct: "left", category: "温泉" },
  { id: 77, question: "「伊豆半島」がある都道府県は？", left: "静岡県", right: "神奈川県", correct: "left", category: "自然" },
  { id: 78, question: "「天童市」は何の将棋駒の生産で有名？", left: "山形県", right: "福島県", correct: "left", category: "伝統・名産" },
  { id: 79, question: "「三陸海岸」が面している海は？", left: "太平洋", right: "日本海", correct: "left", category: "自然" },
  { id: 80, question: "「男鹿半島のなまはげ」で有名な都道府県は？", left: "秋田県", right: "青森県", correct: "left", category: "伝統・行事" },
  { id: 81, question: "「鳴門の渦潮」が見られる海峡がある県は？", left: "徳島県", right: "兵庫県", correct: "left", category: "自然" },
  { id: 82, question: "「天草諸島」がある都道府県は？", left: "熊本県", right: "長崎県", correct: "left", category: "自然・歴史" },
  { id: 83, question: "「軍艦島（端島）」がある都道府県は？", left: "長崎県", right: "福岡県", correct: "left", category: "世界遺産" },
  { id: 84, question: "「石垣島」や「竹富島」がある八重山諸島の県は？", left: "沖縄県", right: "鹿児島県", correct: "left", category: "離島・観光" },
  { id: 85, question: "「与論島」がある都道府県は？", left: "鹿児島県", right: "沖縄県", correct: "left", category: "離島" },
  { id: 86, question: "「大内宿」の茅葺き屋根の宿場町がある県は？", left: "福島県", right: "栃木県", correct: "left", category: "歴史・街道" },
  { id: 87, question: "「吹割の滝」で知られる東洋のナイアガラがある県は？", left: "群馬県", right: "長野県", correct: "left", category: "自然" },
  { id: 88, question: "「秩父夜祭」が開催される都道府県は？", left: "埼玉県", right: "東京都", correct: "left", category: "祭り" },
  { id: 89, question: "「江の島」がある都道府県は？", left: "神奈川県", right: "千葉県", correct: "left", category: "名所" },
  { id: 90, question: "「立山黒部ダム」がある都道府県は？", left: "富山県", right: "長野県", correct: "left", category: "建造物" },
  { id: 91, question: "「千里浜ドライブウェイ」という車で砂浜を走れる県は？", left: "石川県", right: "福井県", correct: "left", category: "絶景" },
  { id: 92, question: "「伊勢志摩サミット」が開催された志摩半島がある県は？", left: "三重県", right: "愛知県", correct: "left", category: "観光" },
  { id: 93, question: "「祇園祭」が夏に開催される都市は？", left: "京都市", right: "奈良市", correct: "left", category: "祭り" },
  { id: 94, question: "「天神祭」が開催される都市は？", left: "大阪市", right: "神戸市", correct: "left", category: "祭り" },
  { id: 95, question: "「姫路城」の別名はどちら？", left: "白鷺城", right: "烏城", correct: "left", category: "城・歴史" },
  { id: 96, question: "「岡山城」の別名はどちら？", left: "烏城", right: "白鷺城", correct: "left", category: "城・歴史" },
  { id: 97, question: "「金閣寺」の正式名称は？", left: "鹿苑寺", right: "慈照寺", correct: "left", category: "世界遺産" },
  { id: 98, question: "「銀閣寺」の正式名称は？", left: "慈照寺", right: "鹿苑寺", correct: "left", category: "世界遺産" },
  { id: 99, question: "「日本三景」の一つ「松島」がある都道府県は？", left: "宮城県", right: "岩手県", correct: "left", category: "名所" },
  { id: 100, question: "「日本三名泉」は草津、有馬とあと一つは？", left: "下呂温泉", right: "別府温泉", correct: "left", category: "温泉" }
];

export default function App() {
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'GAMEOVER'>('START');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizzes, setQuizzes] = useState(QUIZ_DATABASE);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const x = useMotionValue(0);
  const controls = useAnimation();
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const leftOpacity = useTransform(x, [-150, -20], [1, 0]);
  const rightOpacity = useTransform(x, [20, 150], [0, 1]);

  // クイズのシャッフル
  const startNewGame = () => {
    const shuffled = [...QUIZ_DATABASE].sort(() => Math.random() - 0.5);
    setQuizzes(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameState('PLAYING');
  };

  // タイマー処理
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('GAMEOVER');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // 回答処理
  const handleAnswer = (direction: 'left' | 'right') => {
    const currentQuiz = quizzes[currentIndex];
    const isCorrect = currentQuiz.correct === direction;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentIndex((prev) => (prev + 1) % quizzes.length);
      x.set(0);
    }, 150);
  };

  // ドラッグ終了時のフリック判定
  const handleDragEnd = (_: any, info: any) => {
    const threshold = 80;
    if (info.offset.x < -threshold) {
      controls.start({ x: -300, opacity: 0 }).then(() => {
        handleAnswer('left');
        controls.set({ x: 0, opacity: 1 });
      });
    } else if (info.offset.x > threshold) {
      controls.start({ x: 300, opacity: 0 }).then(() => {
        handleAnswer('right');
        controls.set({ x: 0, opacity: 1 });
      });
    } else {
      controls.start({ x: 0 });
    }
  };

  const currentQuiz = quizzes[currentIndex];

  return (
    <div className="app-container">
      <div className="wave-bg" />

      {/* ヘッダー情報 */}
      <div className="header">
        <div className="stat-box">
          <Timer size={22} color="#e0a96d" />
          <span>残り:</span>
          <span className="stat-value">{timeLeft}秒</span>
        </div>
        <div className="stat-box">
          <Trophy size={22} color="#e0a96d" />
          <span>スコア:</span>
          <span className="stat-value">{score}点</span>
        </div>
      </div>

      {/* ゲームエリア */}
      {gameState === 'PLAYING' && currentQuiz && (
        <div className="game-area">
          <div className="card-wrapper">
            <motion.div
              className="card"
              style={{ x, rotate }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={controls}
              whileTap={{ cursor: 'grabbing' }}
            >
              <span className="category-tag">{currentQuiz.category}</span>
              <div className="question-text">{currentQuiz.question}</div>
              <div className="hint-text">← 左 または 右 → にフリック</div>

              <div className="flick-indicators">
                <motion.div className="option-badge option-left" style={{ opacity: leftOpacity }}>
                  <ArrowLeft size={18} /> {currentQuiz.left}
                </motion.div>
                <motion.div className="option-badge option-right" style={{ opacity: rightOpacity }}>
                  {currentQuiz.right} <ArrowRight size={18} />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="flick-indicators" style={{ marginTop: '30px', maxWidth: '340px' }}>
            <button className="option-badge option-left" onClick={() => handleAnswer('left')}>
              <ArrowLeft size={18} /> {currentQuiz.left}
            </button>
            <button className="option-badge option-right" onClick={() => handleAnswer('right')}>
              {currentQuiz.right} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* スタート画面 */}
      {gameState === 'START' && (
        <div className="overlay-screen">
          <h1 className="title">日本ご当地<br />フリッククイズ</h1>
          <p className="subtitle">
            史跡・名所・名物クイズ100問！<br />
            左右フリックで正解を選んで高得点を狙おう。
          </p>
          <button className="btn-start" onClick={startNewGame}>
            <Play size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            ゲーム開始
          </button>
        </div>
      )}

      {/* 終了画面 */}
      {gameState === 'GAMEOVER' && (
        <div className="overlay-screen">
          <h2 className="title">タイムアップ！</h2>
          <p className="subtitle">あなたの最終スコア</p>
          <div className="result-score">{score}点</div>
          <p className="subtitle">（正解数: {score / 10} 問）</p>
          <button className="btn-start" onClick={startNewGame}>
            <RotateCcw size={22} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            もう一度挑戦
          </button>
        </div>
      )}
    </div>
  );
}