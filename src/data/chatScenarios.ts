/**
 * Situations for the AI conversation practice (ฝึก → คุยกับ AI).
 * Japanese text uses kanji[reading] so the chat can draw furigana: 駅[えき]. `brief` is for the model (English).
 */
export type ChatLevel = 'N5' | 'N4' | 'N3';

export interface ChatGoal {
  id: string;
  /** Shown to the learner (Thai). */
  th: string;
}

export interface ChatScenario {
  id: string;
  emoji: string;
  title: string;
  level: ChatLevel;
  /** Who the learner talks to (Thai). */
  partner: string;
  /** One Thai line: what the learner has to do. */
  intro: string;
  /** Role, place and behaviour for the model. */
  brief: string;
  goals: ChatGoal[];
  opening: { ja: string; th: string };
}

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: 'intro',
    emoji: '👋',
    title: 'แนะนำตัวกับเพื่อนใหม่',
    level: 'N5',
    partner: 'ยูกิ เพื่อนร่วมชั้นเรียนภาษา',
    intro: 'เจอเพื่อนใหม่ในห้องเรียน ทักทายและแนะนำตัว',
    brief: 'You are Yuki, a friendly Japanese classmate meeting the learner for the first time at a language school. Polite です/ます speech. Ask simple questions: name, country, hobbies.',
    goals: [
      { id: 'name', th: 'บอกชื่อตัวเอง' },
      { id: 'from', th: 'บอกว่ามาจากประเทศไหน' },
      { id: 'hobby', th: 'บอกงานอดิเรกหรือสิ่งที่ชอบ' },
    ],
    opening: { ja: 'はじめまして！ゆきです。お名前[なまえ]は何[なん]ですか？', th: 'ยินดีที่ได้รู้จัก! ฉันยูกิค่ะ คุณชื่ออะไรคะ?' },
  },
  {
    id: 'konbini',
    emoji: '🏪',
    title: 'ร้านสะดวกซื้อ',
    level: 'N5',
    partner: 'พนักงานร้านสะดวกซื้อ',
    intro: 'ซื้อข้าวกล่อง ให้พนักงานอุ่น และจ่ายเงิน',
    brief: 'You are a convenience-store clerk at the register in Japan. Standard polite shop phrases, short. The customer buys a bento: ask about heating it, a bag, chopsticks, then tell the price (use a simple price) and take payment.',
    goals: [
      { id: 'heat', th: 'ตอบเรื่องอุ่นข้าวกล่อง' },
      { id: 'bag', th: 'บอกว่าเอาถุงหรือไม่เอา' },
      { id: 'pay', th: 'จ่ายเงิน (เงินสดหรือบัตร)' },
    ],
    opening: { ja: 'いらっしゃいませ！お弁当[べんとう]、温[あたた]めますか？', th: 'ยินดีต้อนรับค่ะ! ข้าวกล่องอุ่นไหมคะ?' },
  },
  {
    id: 'ramen',
    emoji: '🍜',
    title: 'สั่งราเม็ง',
    level: 'N5',
    partner: 'พนักงานร้านราเม็ง',
    intro: 'สั่งราเม็ง ขอปรับตามที่ชอบ แล้วเรียกเก็บเงิน',
    brief: 'You are staff at a small ramen shop. Polite but brisk. Menu: しょうゆラーメン 800円, みそラーメン 900円, とんこつラーメン 950円, ぎょうざ 400円. Take the order, ask about noodle firmness or toppings, and handle the bill.',
    goals: [
      { id: 'order', th: 'สั่งราเม็ง 1 อย่าง' },
      { id: 'custom', th: 'ขอเพิ่มหรือไม่ใส่อะไรสักอย่าง' },
      { id: 'bill', th: 'ขอเช็กบิล' },
    ],
    opening: { ja: 'いらっしゃいませ！ご注文[ちゅうもん]は何[なに]にしますか？', th: 'ยินดีต้อนรับครับ! รับอะไรดีครับ?' },
  },
  {
    id: 'directions',
    emoji: '🗺️',
    title: 'ถามทางไปสถานี',
    level: 'N5',
    partner: 'คนเดินผ่านในเมือง',
    intro: 'หลงทาง ถามทางไปสถานีรถไฟ',
    brief: 'You are a kind passer-by in a Japanese city. The learner is lost and wants to get to the station. Give simple directions (straight, turn right/left, about 5 minutes on foot, next to a landmark). Polite speech.',
    goals: [
      { id: 'ask', th: 'ถามทางไปสถานี' },
      { id: 'time', th: 'ถามว่าใช้เวลาเดินกี่นาที' },
      { id: 'thanks', th: 'ขอบคุณ' },
    ],
    opening: { ja: 'はい、どうしましたか？', th: 'ครับ มีอะไรให้ช่วยไหมครับ?' },
  },
  {
    id: 'ticket',
    emoji: '🚄',
    title: 'ซื้อตั๋วชินคันเซ็น',
    level: 'N5',
    partner: 'พนักงานขายตั๋ว',
    intro: 'ซื้อตั๋วไปเกียวโต เลือกเวลาและที่นั่ง',
    brief: 'You are a ticket-office clerk at Tokyo Station. The learner wants a Shinkansen ticket to Kyoto. Ask: when, how many people, reserved or non-reserved seat, window or aisle. Give a simple price. Polite speech.',
    goals: [
      { id: 'dest', th: 'บอกว่าจะไปเกียวโต' },
      { id: 'when', th: 'บอกวันหรือเวลา' },
      { id: 'seat', th: 'เลือกที่นั่ง' },
    ],
    opening: { ja: 'こんにちは。どちらまで行[い]きますか？', th: 'สวัสดีค่ะ จะเดินทางไปที่ไหนคะ?' },
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'เช็กอินโรงแรม',
    level: 'N5',
    partner: 'พนักงานต้อนรับโรงแรม',
    intro: 'เช็กอิน ถามเรื่องอาหารเช้าและ Wi-Fi',
    brief: 'You are a hotel front-desk clerk. The learner has a reservation for 2 nights. Ask for the name, confirm nights, explain breakfast (7 to 9 am, 2nd floor) and Wi-Fi when asked. Polite hotel speech but simple.',
    goals: [
      { id: 'checkin', th: 'บอกว่าจองห้องไว้และบอกชื่อ' },
      { id: 'breakfast', th: 'ถามเวลาอาหารเช้า' },
      { id: 'wifi', th: 'ถามเรื่อง Wi-Fi' },
    ],
    opening: { ja: 'いらっしゃいませ。チェックインですか？', th: 'ยินดีต้อนรับค่ะ เช็กอินใช่ไหมคะ?' },
  },
  {
    id: 'clothes',
    emoji: '👕',
    title: 'ร้านเสื้อผ้า',
    level: 'N4',
    partner: 'พนักงานร้านเสื้อผ้า',
    intro: 'หาเสื้อ ขอลอง และถามไซซ์หรือสีอื่น',
    brief: 'You are a clothing-shop assistant. Help the learner find a shirt or jacket: ask what they look for, offer the fitting room, discuss size and other colours, mention the price. Polite customer-service speech.',
    goals: [
      { id: 'want', th: 'บอกว่ากำลังหาอะไร' },
      { id: 'try', th: 'ขอลองใส่' },
      { id: 'size', th: 'ถามไซซ์หรือสีอื่น' },
    ],
    opening: { ja: 'いらっしゃいませ。何[なに]かお探[さが]しですか？', th: 'ยินดีต้อนรับค่ะ กำลังหาอะไรอยู่หรือเปล่าคะ?' },
  },
  {
    id: 'pharmacy',
    emoji: '💊',
    title: 'ร้านขายยา',
    level: 'N4',
    partner: 'เภสัชกร',
    intro: 'ไม่สบาย อธิบายอาการและถามวิธีกินยา',
    brief: 'You are a pharmacist in a Japanese drugstore. The learner feels unwell. Ask about symptoms and since when, recommend a medicine, explain how to take it (after meals, three times a day). Polite and caring.',
    goals: [
      { id: 'symptom', th: 'บอกอาการ' },
      { id: 'since', th: 'บอกว่าเป็นมาตั้งแต่เมื่อไร' },
      { id: 'how', th: 'ถามวิธีกินยา' },
    ],
    opening: { ja: 'こんにちは。どうされましたか？', th: 'สวัสดีครับ เป็นอะไรมาครับ?' },
  },
  {
    id: 'plans',
    emoji: '📱',
    title: 'นัดเพื่อนไปเที่ยว',
    level: 'N4',
    partner: 'เคนตะ เพื่อนสนิท',
    intro: 'ชวนเพื่อนไปเที่ยววันหยุด ตกลงที่ เวลา และจุดนัดพบ',
    brief: 'You are Kenta, the learner\'s close friend. Casual speech (だ/よ/ね, no です/ます). You are free on the weekend. Decide together where to go, what time and where to meet.',
    goals: [
      { id: 'invite', th: 'ชวนไปเที่ยว' },
      { id: 'place', th: 'ตกลงว่าจะไปที่ไหน' },
      { id: 'meet', th: 'นัดเวลาและจุดนัดพบ' },
    ],
    opening: { ja: 'もしもし、どうしたの？', th: 'ฮัลโหล มีอะไรเหรอ?' },
  },
  {
    id: 'restaurant',
    emoji: '🍱',
    title: 'จองโต๊ะร้านอาหาร',
    level: 'N4',
    partner: 'พนักงานร้านอาหาร (ทางโทรศัพท์)',
    intro: 'โทรจองโต๊ะ บอกวัน เวลา และจำนวนคน',
    brief: 'You are restaurant staff answering the phone. Take a reservation: date, time, number of people, name, and ask about allergies. Polite phone speech.',
    goals: [
      { id: 'reserve', th: 'บอกว่าต้องการจองโต๊ะ' },
      { id: 'detail', th: 'บอกวัน เวลา และจำนวนคน' },
      { id: 'name', th: 'บอกชื่อผู้จอง' },
    ],
    opening: { ja: 'お電話[でんわ]ありがとうございます。レストランさくらです。', th: 'ขอบคุณที่โทรมาค่ะ ร้านอาหารซากุระค่ะ' },
  },
  {
    id: 'interview',
    emoji: '💼',
    title: 'สัมภาษณ์งานพาร์ตไทม์',
    level: 'N3',
    partner: 'ผู้จัดการร้านกาแฟ',
    intro: 'สัมภาษณ์งานพาร์ตไทม์ที่ร้านกาแฟ',
    brief: 'You are a cafe manager interviewing the learner for a part-time job. Polite interview speech. Ask: self-introduction, why this job, which days and hours they can work, past experience.',
    goals: [
      { id: 'self', th: 'แนะนำตัว' },
      { id: 'why', th: 'บอกเหตุผลที่อยากทำงานนี้' },
      { id: 'shift', th: 'บอกวันและเวลาที่ทำงานได้' },
    ],
    opening: { ja: '本日[ほんじつ]はありがとうございます。では、自己紹介[じこしょうかい]をお願[ねが]いします。', th: 'ขอบคุณที่มาวันนี้ครับ งั้นเชิญแนะนำตัวเลยครับ' },
  },
  {
    id: 'anime',
    emoji: '⚔️',
    title: 'คุยเรื่องอนิเมะ',
    level: 'N3',
    partner: 'ฮารุ เพื่อนสายอนิเมะ',
    intro: 'คุยเรื่องอนิเมะที่ชอบ ตัวละคร และฉากที่ประทับใจ',
    brief: 'You are Haru, an anime-loving friend. Casual, lively speech. Talk about favourite anime, characters and memorable scenes; share your own opinions and ask follow-up questions.',
    goals: [
      { id: 'fav', th: 'บอกอนิเมะที่ชอบ' },
      { id: 'why', th: 'บอกเหตุผลที่ชอบ' },
      { id: 'char', th: 'พูดถึงตัวละครหรือฉากที่ชอบ' },
    ],
    opening: { ja: 'ねえ、最近[さいきん]何[なに]かアニメ見[み]てる？', th: 'นี่ ช่วงนี้ดูอนิเมะอะไรอยู่บ้าง?' },
  },
  {
    id: 'fox',
    emoji: '🦊',
    title: 'คุยเล่นกับจิ้งจอก',
    level: 'N5',
    partner: 'คอน จิ้งจอกของうまみ',
    intro: 'คุยเรื่องอะไรก็ได้ ไม่มีภารกิจ',
    brief: 'You are コン (Kon), the cheerful fox mascot of the うまみ app and the learner\'s study buddy. Casual, warm, playful speech. Chat about their day, food, hobbies, anything. Match the learner\'s level; keep it easy.',
    goals: [],
    opening: { ja: 'やっほー！コンだよ。今日[きょう]は何[なに]をしたの？', th: 'ยะโฮ่! คอนเองนะ วันนี้ทำอะไรมาบ้าง?' },
  },
];
