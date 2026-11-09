import {
  JLPTLevel,
  VideoCategory,
  VideoRecord,
  SubtitleLineRecord,
  DictionaryWordRecord,
} from '../schema/databaseSchema';

export const DICTIONARY_WORDS: DictionaryWordRecord[] = [
  {
    "id": "w-taberu",
    "lemma": "食べる",
    "reading_kana": "たべる",
    "romaji": "taberu",
    "jlpt_level": "N5",
    "frequency_rank": 5,
    "part_of_speech": "Verb",
    "core_meanings": [
      "กิน",
      "ทาน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "べ",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-nomu",
    "lemma": "飲む",
    "reading_kana": "ของขวัญ",
    "romaji": "nomu",
    "jlpt_level": "N5",
    "frequency_rank": 8,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ดื่ม"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ข",
        "high": false
      },
      {
        "mora": "อ",
        "high": true
      },
      {
        "mora": "ง",
        "high": true
      },
      {
        "mora": "ข",
        "high": true
      },
      {
        "mora": "ว",
        "high": true
      },
      {
        "mora": "ั",
        "high": true
      },
      {
        "mora": "ญ",
        "high": true
      }
    ]
  },
  {
    "id": "w-iku",
    "lemma": "行く",
    "reading_kana": "いく",
    "romaji": "iku",
    "jlpt_level": "N5",
    "frequency_rank": 2,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ไป"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-kuru",
    "lemma": "来る",
    "reading_kana": "くる",
    "romaji": "kuru",
    "jlpt_level": "N5",
    "frequency_rank": 3,
    "part_of_speech": "Verb",
    "core_meanings": [
      "มา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "く",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-kaeru",
    "lemma": "帰る",
    "reading_kana": "かえる",
    "romaji": "kaeru",
    "jlpt_level": "N5",
    "frequency_rank": 9,
    "part_of_speech": "Verb",
    "core_meanings": [
      "กลับ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "え",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-miru",
    "lemma": "見る",
    "reading_kana": "みる",
    "romaji": "miru",
    "jlpt_level": "N5",
    "frequency_rank": 4,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ดู",
      "มอง",
      "เห็น"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "み",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-kiku",
    "lemma": "聞く",
    "reading_kana": "きく",
    "romaji": "kiku",
    "jlpt_level": "N5",
    "frequency_rank": 7,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ฟัง",
      "ได้ยิน",
      "ถาม"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-hanasu",
    "lemma": "話す",
    "reading_kana": "はなす",
    "romaji": "hanasu",
    "jlpt_level": "N5",
    "frequency_rank": 10,
    "part_of_speech": "Verb",
    "core_meanings": [
      "พูดคุย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "は",
        "high": false
      },
      {
        "mora": "な",
        "high": true
      },
      {
        "mora": "す",
        "high": true
      }
    ]
  },
  {
    "id": "w-yomu",
    "lemma": "読む",
    "reading_kana": "よむ",
    "romaji": "yomu",
    "jlpt_level": "N5",
    "frequency_rank": 12,
    "part_of_speech": "Verb",
    "core_meanings": [
      "อ่าน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "よ",
        "high": false
      },
      {
        "mora": "む",
        "high": true
      }
    ]
  },
  {
    "id": "w-kaku",
    "lemma": "書く",
    "reading_kana": "かく",
    "romaji": "kaku",
    "jlpt_level": "N5",
    "frequency_rank": 14,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เขียน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-kau",
    "lemma": "買う",
    "reading_kana": "かう",
    "romaji": "kau",
    "jlpt_level": "N5",
    "frequency_rank": 15,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ซื้อ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-matsu",
    "lemma": "待つ",
    "reading_kana": "まつ",
    "romaji": "matsu",
    "jlpt_level": "N5",
    "frequency_rank": 16,
    "part_of_speech": "Verb",
    "core_meanings": [
      "รอ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ま",
        "high": false
      },
      {
        "mora": "つ",
        "high": true
      }
    ]
  },
  {
    "id": "w-yobu",
    "lemma": "呼ぶ",
    "reading_kana": "よぶ",
    "romaji": "yobu",
    "jlpt_level": "N5",
    "frequency_rank": 22,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เรียก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "よ",
        "high": false
      },
      {
        "mora": "ぶ",
        "high": true
      }
    ]
  },
  {
    "id": "w-hashiru",
    "lemma": "走る",
    "reading_kana": "はしる",
    "romaji": "hashiru",
    "jlpt_level": "N5",
    "frequency_rank": 25,
    "part_of_speech": "Verb",
    "core_meanings": [
      "วิ่ง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "は",
        "high": false
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-okiru",
    "lemma": "起きる",
    "reading_kana": "おきる",
    "romaji": "okiru",
    "jlpt_level": "N5",
    "frequency_rank": 18,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ตื่นนอน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-neru",
    "lemma": "寝る",
    "reading_kana": "ねる",
    "romaji": "neru",
    "jlpt_level": "N5",
    "frequency_rank": 19,
    "part_of_speech": "Verb",
    "core_meanings": [
      "นอน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ね",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-hataraku",
    "lemma": "働く",
    "reading_kana": "はたらく",
    "romaji": "hataraku",
    "jlpt_level": "N5",
    "frequency_rank": 24,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ทำงาน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "は",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "ら",
        "high": true
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-benkyou",
    "lemma": "勉強する",
    "reading_kana": "べんきょうする",
    "romaji": "benkyousuru",
    "jlpt_level": "N5",
    "frequency_rank": 20,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เรียนหนังสือ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "べ",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "ょ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      },
      {
        "mora": "す",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-wakaru",
    "lemma": "わかる",
    "reading_kana": "わかる",
    "romaji": "wakaru",
    "jlpt_level": "N5",
    "frequency_rank": 6,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เข้าใจ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "わ",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-dekiru",
    "lemma": "できる",
    "reading_kana": "できる",
    "romaji": "dekiru",
    "jlpt_level": "N5",
    "frequency_rank": 11,
    "part_of_speech": "Verb",
    "core_meanings": [
      "สามารถทำได้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "で",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-au",
    "lemma": "会う",
    "reading_kana": "あう",
    "romaji": "au",
    "jlpt_level": "N5",
    "frequency_rank": 17,
    "part_of_speech": "Verb",
    "core_meanings": [
      "พบ",
      "เจอ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-tsukau",
    "lemma": "使う",
    "reading_kana": "つかう",
    "romaji": "tsukau",
    "jlpt_level": "N5",
    "frequency_rank": 13,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ใช้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "つ",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-motsu",
    "lemma": "持つ",
    "reading_kana": "もつ",
    "romaji": "motsu",
    "jlpt_level": "N5",
    "frequency_rank": 21,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ถือ",
      "มี"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "も",
        "high": false
      },
      {
        "mora": "つ",
        "high": true
      }
    ]
  },
  {
    "id": "w-shiru",
    "lemma": "知る",
    "reading_kana": "しる",
    "romaji": "shiru",
    "jlpt_level": "N5",
    "frequency_rank": 23,
    "part_of_speech": "Verb",
    "core_meanings": [
      "รู้",
      "รู้จัก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "し",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-erabu",
    "lemma": "選ぶ",
    "reading_kana": "えらぶ",
    "romaji": "erabu",
    "jlpt_level": "N5",
    "frequency_rank": 28,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เลือก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "え",
        "high": false
      },
      {
        "mora": "ら",
        "high": true
      },
      {
        "mora": "ぶ",
        "high": true
      }
    ]
  },
  {
    "id": "w-oboeru",
    "lemma": "覚える",
    "reading_kana": "おぼえる",
    "romaji": "oboeru",
    "jlpt_level": "N4",
    "frequency_rank": 31,
    "part_of_speech": "Verb",
    "core_meanings": [
      "จดจำ",
      "จำได้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "ぼ",
        "high": true
      },
      {
        "mora": "え",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-wasureru",
    "lemma": "忘れる",
    "reading_kana": "わすれる",
    "romaji": "wasureru",
    "jlpt_level": "N4",
    "frequency_rank": 33,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ลืม"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "わ",
        "high": false
      },
      {
        "mora": "す",
        "high": true
      },
      {
        "mora": "れ",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-sagasu",
    "lemma": "探す",
    "reading_kana": "さがす",
    "romaji": "sagasu",
    "jlpt_level": "N4",
    "frequency_rank": 35,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ค้นหา",
      "ตามหา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "さ",
        "high": false
      },
      {
        "mora": "が",
        "high": true
      },
      {
        "mora": "す",
        "high": true
      }
    ]
  },
  {
    "id": "w-tasukeru",
    "lemma": "助ける",
    "reading_kana": "たすける",
    "romaji": "tasukeru",
    "jlpt_level": "N4",
    "frequency_rank": 38,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ช่วยเหลือ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "す",
        "high": true
      },
      {
        "mora": "け",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-mamoru",
    "lemma": "守る",
    "reading_kana": "まもる",
    "romaji": "mamoru",
    "jlpt_level": "N4",
    "frequency_rank": 40,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ปกป้อง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ま",
        "high": false
      },
      {
        "mora": "も",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-tatakau",
    "lemma": "戦う",
    "reading_kana": "たたかう",
    "romaji": "tatakau",
    "jlpt_level": "N4",
    "frequency_rank": 42,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ต่อสู้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-katsu",
    "lemma": "勝つ",
    "reading_kana": "かつ",
    "romaji": "katsu",
    "jlpt_level": "N4",
    "frequency_rank": 45,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ชนะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "つ",
        "high": true
      }
    ]
  },
  {
    "id": "w-makeru",
    "lemma": "負ける",
    "reading_kana": "まける",
    "romaji": "makeru",
    "jlpt_level": "N4",
    "frequency_rank": 47,
    "part_of_speech": "Verb",
    "core_meanings": [
      "แพ้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ま",
        "high": false
      },
      {
        "mora": "け",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-shinjiru",
    "lemma": "信じる",
    "reading_kana": "しんじる",
    "romaji": "shinjiru",
    "jlpt_level": "N4",
    "frequency_rank": 50,
    "part_of_speech": "Verb",
    "core_meanings": [
      "เชื่อมั่น"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "し",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "じ",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-akirameru",
    "lemma": "諦める",
    "reading_kana": "あきらめる",
    "romaji": "akirameru",
    "jlpt_level": "N4",
    "frequency_rank": 52,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ยอมแพ้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "ら",
        "high": true
      },
      {
        "mora": "め",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-kimeru",
    "lemma": "決める",
    "reading_kana": "きめる",
    "romaji": "kimeru",
    "jlpt_level": "N4",
    "frequency_rank": 36,
    "part_of_speech": "Verb",
    "core_meanings": [
      "ตัดสินใจ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "め",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-ikiru",
    "lemma": "生きる",
    "reading_kana": "いきる",
    "romaji": "ikiru",
    "jlpt_level": "N4",
    "frequency_rank": 48,
    "part_of_speech": "Verb",
    "core_meanings": [
      "มีชีวิตอยู่",
      "รอด"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-tsutaeru",
    "lemma": "伝える",
    "reading_kana": "つたえる",
    "romaji": "tsutaeru",
    "jlpt_level": "N4",
    "frequency_rank": 44,
    "part_of_speech": "Verb",
    "core_meanings": [
      "สื่อสาร",
      "บอกต่อ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "つ",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "え",
        "high": true
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-ookii",
    "lemma": "大きい",
    "reading_kana": "おおきい",
    "romaji": "ookii",
    "jlpt_level": "N5",
    "frequency_rank": 26,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ใหญ่"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "お",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-chiisai",
    "lemma": "小さい",
    "reading_kana": "ちいさい",
    "romaji": "chiisai",
    "jlpt_level": "N5",
    "frequency_rank": 27,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "เล็ก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ち",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "さ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-atarashii",
    "lemma": "新しい",
    "reading_kana": "あたらしい",
    "romaji": "atarashii",
    "jlpt_level": "N5",
    "frequency_rank": 29,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ใหม่"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "ら",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-furui",
    "lemma": "古い",
    "reading_kana": "ふるい",
    "romaji": "furui",
    "jlpt_level": "N5",
    "frequency_rank": 30,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "เก่า"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ふ",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-ii",
    "lemma": "良い",
    "reading_kana": "いい",
    "romaji": "ii",
    "jlpt_level": "N5",
    "frequency_rank": 1,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ดี",
      "เยี่ยม"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-warui",
    "lemma": "悪い",
    "reading_kana": "わるい",
    "romaji": "warui",
    "jlpt_level": "N5",
    "frequency_rank": 34,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "แย่",
      "ไม่ดี"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "わ",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-takai",
    "lemma": "高い",
    "reading_kana": "たかい",
    "romaji": "takai",
    "jlpt_level": "N5",
    "frequency_rank": 32,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "สูง",
      "ราคาแพง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-yasui",
    "lemma": "安い",
    "reading_kana": "やすい",
    "romaji": "yasui",
    "jlpt_level": "N5",
    "frequency_rank": 37,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ราคาถูก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "や",
        "high": false
      },
      {
        "mora": "す",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-atsui",
    "lemma": "熱い",
    "reading_kana": "あつい",
    "romaji": "atsui",
    "jlpt_level": "N5",
    "frequency_rank": 39,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ร้อน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "つ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-samui",
    "lemma": "寒い",
    "reading_kana": "さむい",
    "romaji": "samui",
    "jlpt_level": "N5",
    "frequency_rank": 41,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "หนาว"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "さ",
        "high": false
      },
      {
        "mora": "む",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-tsumetai",
    "lemma": "冷たい",
    "reading_kana": "つめたい",
    "romaji": "tsumetai",
    "jlpt_level": "N5",
    "frequency_rank": 43,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "เย็น"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "つ",
        "high": false
      },
      {
        "mora": "め",
        "high": true
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-muzukashii",
    "lemma": "難しい",
    "reading_kana": "むずかしい",
    "romaji": "muzukashii",
    "jlpt_level": "N5",
    "frequency_rank": 46,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "ยาก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "む",
        "high": false
      },
      {
        "mora": "ず",
        "high": true
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-tanoshii",
    "lemma": "楽しい",
    "reading_kana": "たのしい",
    "romaji": "tanoshii",
    "jlpt_level": "N5",
    "frequency_rank": 49,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "สนุกสนาน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "の",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-omoshiroi",
    "lemma": "面白い",
    "reading_kana": "おもしろい",
    "romaji": "omoshiroi",
    "jlpt_level": "N5",
    "frequency_rank": 51,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "น่าสนใจ",
      "ตลก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "も",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "ろ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-oishii",
    "lemma": "美味しい",
    "reading_kana": "おいしい",
    "romaji": "oishii",
    "jlpt_level": "N5",
    "frequency_rank": 18,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "อร่อย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-suki",
    "lemma": "好き",
    "reading_kana": "すき",
    "romaji": "suki",
    "jlpt_level": "N5",
    "frequency_rank": 53,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "ชอบ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "す",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-kirai",
    "lemma": "嫌い",
    "reading_kana": "きらい",
    "romaji": "kirai",
    "jlpt_level": "N5",
    "frequency_rank": 55,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "เกลียด"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "ら",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-genki",
    "lemma": "元気",
    "reading_kana": "げんき",
    "romaji": "genki",
    "jlpt_level": "N5",
    "frequency_rank": 54,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "แข็งแรง",
      "สดใส"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "げ",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-shizuka",
    "lemma": "静か",
    "reading_kana": "しずか",
    "romaji": "shizuka",
    "jlpt_level": "N5",
    "frequency_rank": 56,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "เงียบสงบ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "し",
        "high": false
      },
      {
        "mora": "ず",
        "high": true
      },
      {
        "mora": "か",
        "high": true
      }
    ]
  },
  {
    "id": "w-benri",
    "lemma": "便利",
    "reading_kana": "べんり",
    "romaji": "benri",
    "jlpt_level": "N5",
    "frequency_rank": 58,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "สะดวกสบาย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "べ",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "り",
        "high": true
      }
    ]
  },
  {
    "id": "w-taisetsu",
    "lemma": "大切",
    "reading_kana": "たいせつ",
    "romaji": "taisetsu",
    "jlpt_level": "N5",
    "frequency_rank": 60,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "สำคัญมาก"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "せ",
        "high": true
      },
      {
        "mora": "つ",
        "high": true
      }
    ]
  },
  {
    "id": "w-kirei",
    "lemma": "綺麗",
    "reading_kana": "きれい",
    "romaji": "kirei",
    "jlpt_level": "N5",
    "frequency_rank": 62,
    "part_of_speech": "Na-Adjective",
    "core_meanings": [
      "สวยงาม",
      "สะอาด"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "れ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-tsuyoi",
    "lemma": "強い",
    "reading_kana": "つよい",
    "romaji": "tsuyoi",
    "jlpt_level": "N4",
    "frequency_rank": 64,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "แข็งแกร่ง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "つ",
        "high": false
      },
      {
        "mora": "よ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-yowai",
    "lemma": "弱い",
    "reading_kana": "よわい",
    "romaji": "yowai",
    "jlpt_level": "N4",
    "frequency_rank": 66,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "อ่อนแอ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "よ",
        "high": false
      },
      {
        "mora": "わ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-hayai",
    "lemma": "早い",
    "reading_kana": "はやい",
    "romaji": "hayai",
    "jlpt_level": "N5",
    "frequency_rank": 57,
    "part_of_speech": "I-Adjective",
    "core_meanings": [
      "เร็ว",
      "เช้า"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "は",
        "high": false
      },
      {
        "mora": "や",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-watashi",
    "lemma": "私",
    "reading_kana": "わたし",
    "romaji": "watashi",
    "jlpt_level": "N5",
    "frequency_rank": 3,
    "part_of_speech": "Pronoun",
    "core_meanings": [
      "ฉัน",
      "ผม"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "わ",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "し",
        "high": true
      }
    ]
  },
  {
    "id": "w-boku",
    "lemma": "僕",
    "reading_kana": "ぼく",
    "romaji": "boku",
    "jlpt_level": "N5",
    "frequency_rank": 61,
    "part_of_speech": "Pronoun",
    "core_meanings": [
      "ผม (ชาย)"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ぼ",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-ore",
    "lemma": "俺",
    "reading_kana": "おれ",
    "romaji": "ore",
    "jlpt_level": "N4",
    "frequency_rank": 63,
    "part_of_speech": "Pronoun",
    "core_meanings": [
      "ข้า",
      "ฉัน (ภาษาพูดชาย)"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "れ",
        "high": true
      }
    ]
  },
  {
    "id": "w-anata",
    "lemma": "あなた",
    "reading_kana": "あなた",
    "romaji": "anata",
    "jlpt_level": "N5",
    "frequency_rank": 65,
    "part_of_speech": "Pronoun",
    "core_meanings": [
      "คุณ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "な",
        "high": true
      },
      {
        "mora": "た",
        "high": true
      }
    ]
  },
  {
    "id": "w-tomodachi",
    "lemma": "友達",
    "reading_kana": "ともだち",
    "romaji": "tomodachi",
    "jlpt_level": "N5",
    "frequency_rank": 15,
    "part_of_speech": "Noun",
    "core_meanings": [
      "เพื่อน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "と",
        "high": false
      },
      {
        "mora": "も",
        "high": true
      },
      {
        "mora": "だ",
        "high": true
      },
      {
        "mora": "ち",
        "high": true
      }
    ]
  },
  {
    "id": "w-nakama",
    "lemma": "仲間",
    "reading_kana": "なかま",
    "romaji": "nakama",
    "jlpt_level": "N4",
    "frequency_rank": 67,
    "part_of_speech": "Noun",
    "core_meanings": [
      "พวกพ้อง",
      "สหาย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "な",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "ま",
        "high": true
      }
    ]
  },
  {
    "id": "w-kazoku",
    "lemma": "家族",
    "reading_kana": "かぞく",
    "romaji": "kazoku",
    "jlpt_level": "N5",
    "frequency_rank": 68,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ครอบครัว"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "ぞ",
        "high": true
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-sensei",
    "lemma": "先生",
    "reading_kana": "せんせい",
    "romaji": "sensei",
    "jlpt_level": "N5",
    "frequency_rank": 69,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ครู",
      "อาจารย์"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "せ",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "せ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-gakusei",
    "lemma": "学生",
    "reading_kana": "がくせい",
    "romaji": "gakusei",
    "jlpt_level": "N5",
    "frequency_rank": 70,
    "part_of_speech": "Noun",
    "core_meanings": [
      "นักเรียน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "が",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      },
      {
        "mora": "せ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-hito",
    "lemma": "人",
    "reading_kana": "ひと",
    "romaji": "hito",
    "jlpt_level": "N5",
    "frequency_rank": 71,
    "part_of_speech": "Noun",
    "core_meanings": [
      "คน",
      "มนุษย์"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ひ",
        "high": false
      },
      {
        "mora": "と",
        "high": true
      }
    ]
  },
  {
    "id": "w-nihon",
    "lemma": "日本",
    "reading_kana": "にほん",
    "romaji": "nihon",
    "jlpt_level": "N5",
    "frequency_rank": 72,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ประเทศญี่ปุ่น"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "に",
        "high": false
      },
      {
        "mora": "ほ",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-nihongo",
    "lemma": "日本語",
    "reading_kana": "にほんご",
    "romaji": "nihongo",
    "jlpt_level": "N5",
    "frequency_rank": 73,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ภาษาญี่ปุ่น"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "に",
        "high": false
      },
      {
        "mora": "ほ",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "ご",
        "high": true
      }
    ]
  },
  {
    "id": "w-jikan",
    "lemma": "時間",
    "reading_kana": "じかん",
    "romaji": "jikan",
    "jlpt_level": "N5",
    "frequency_rank": 74,
    "part_of_speech": "Noun",
    "core_meanings": [
      "เวลา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "じ",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-kyou",
    "lemma": "今日",
    "reading_kana": "きょう",
    "romaji": "kyou",
    "jlpt_level": "N5",
    "frequency_rank": 75,
    "part_of_speech": "Noun",
    "core_meanings": [
      "วันนี้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "ょ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-ashita",
    "lemma": "明日",
    "reading_kana": "あした",
    "romaji": "ashita",
    "jlpt_level": "N5",
    "frequency_rank": 76,
    "part_of_speech": "Noun",
    "core_meanings": [
      "พรุ่งนี้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "た",
        "high": true
      }
    ]
  },
  {
    "id": "w-kinou",
    "lemma": "昨日",
    "reading_kana": "きのう",
    "romaji": "kinou",
    "jlpt_level": "N5",
    "frequency_rank": 77,
    "part_of_speech": "Noun",
    "core_meanings": [
      "เมื่อวานนี้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "の",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-ima",
    "lemma": "今",
    "reading_kana": "いま",
    "romaji": "ima",
    "jlpt_level": "N5",
    "frequency_rank": 78,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ตอนนี้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "ま",
        "high": true
      }
    ]
  },
  {
    "id": "w-asa",
    "lemma": "朝",
    "reading_kana": "あさ",
    "romaji": "asa",
    "jlpt_level": "N5",
    "frequency_rank": 79,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ตอนเช้า"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "さ",
        "high": true
      }
    ]
  },
  {
    "id": "w-yoru",
    "lemma": "夜",
    "reading_kana": "よる",
    "romaji": "yoru",
    "jlpt_level": "N5",
    "frequency_rank": 80,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ตอนกลางคืน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "よ",
        "high": false
      },
      {
        "mora": "る",
        "high": true
      }
    ]
  },
  {
    "id": "w-ie",
    "lemma": "家",
    "reading_kana": "いえ",
    "romaji": "ie",
    "jlpt_level": "N5",
    "frequency_rank": 81,
    "part_of_speech": "Noun",
    "core_meanings": [
      "บ้าน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "え",
        "high": true
      }
    ]
  },
  {
    "id": "w-gakkou",
    "lemma": "学校",
    "reading_kana": "がっこう",
    "romaji": "gakkou",
    "jlpt_level": "N5",
    "frequency_rank": 82,
    "part_of_speech": "Noun",
    "core_meanings": [
      "โรงเรียน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "が",
        "high": false
      },
      {
        "mora": "っ",
        "high": true
      },
      {
        "mora": "こ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-eki",
    "lemma": "駅",
    "reading_kana": "えき",
    "romaji": "eki",
    "jlpt_level": "N5",
    "frequency_rank": 83,
    "part_of_speech": "Noun",
    "core_meanings": [
      "สถานีรถไฟ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "え",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-mise",
    "lemma": "店",
    "reading_kana": "みせ",
    "romaji": "mise",
    "jlpt_level": "N5",
    "frequency_rank": 84,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ร้านค้า"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "み",
        "high": false
      },
      {
        "mora": "せ",
        "high": true
      }
    ]
  },
  {
    "id": "w-mizu",
    "lemma": "水",
    "reading_kana": "みず",
    "romaji": "mizu",
    "jlpt_level": "N5",
    "frequency_rank": 85,
    "part_of_speech": "Noun",
    "core_meanings": [
      "น้ำ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "み",
        "high": false
      },
      {
        "mora": "ず",
        "high": true
      }
    ]
  },
  {
    "id": "w-ocha",
    "lemma": "お茶",
    "reading_kana": "おちゃ",
    "romaji": "ocha",
    "jlpt_level": "N5",
    "frequency_rank": 86,
    "part_of_speech": "Noun",
    "core_meanings": [
      "น้ำชา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "ち",
        "high": true
      },
      {
        "mora": "ゃ",
        "high": true
      }
    ]
  },
  {
    "id": "w-gohan",
    "lemma": "ご飯",
    "reading_kana": "ごはん",
    "romaji": "gohan",
    "jlpt_level": "N5",
    "frequency_rank": 87,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ข้าว",
      "อาหาร"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ご",
        "high": false
      },
      {
        "mora": "は",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-hon",
    "lemma": "本",
    "reading_kana": "ほん",
    "romaji": "hon",
    "jlpt_level": "N5",
    "frequency_rank": 88,
    "part_of_speech": "Noun",
    "core_meanings": [
      "หนังสือ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ほ",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-eiga",
    "lemma": "映画",
    "reading_kana": "えいが",
    "romaji": "eiga",
    "jlpt_level": "N5",
    "frequency_rank": 89,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ภาพยนตร์"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "え",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "が",
        "high": true
      }
    ]
  },
  {
    "id": "w-ongaku",
    "lemma": "音楽",
    "reading_kana": "おんがく",
    "romaji": "ongaku",
    "jlpt_level": "N5",
    "frequency_rank": 90,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ดนตรี",
      "เพลง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "お",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "が",
        "high": true
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-kokoro",
    "lemma": "心",
    "reading_kana": "こころ",
    "romaji": "kokoro",
    "jlpt_level": "N4",
    "frequency_rank": 91,
    "part_of_speech": "Noun",
    "core_meanings": [
      "หัวใจ",
      "จิตใจ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "こ",
        "high": false
      },
      {
        "mora": "こ",
        "high": true
      },
      {
        "mora": "ろ",
        "high": true
      }
    ]
  },
  {
    "id": "w-yume",
    "lemma": "夢",
    "reading_kana": "ゆめ",
    "romaji": "yume",
    "jlpt_level": "N4",
    "frequency_rank": 60,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ความฝัน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ゆ",
        "high": false
      },
      {
        "mora": "め",
        "high": true
      }
    ]
  },
  {
    "id": "w-hikari",
    "lemma": "光",
    "reading_kana": "ひかり",
    "romaji": "hikari",
    "jlpt_level": "N4",
    "frequency_rank": 45,
    "part_of_speech": "Noun",
    "core_meanings": [
      "แสงสว่าง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ひ",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "り",
        "high": true
      }
    ]
  },
  {
    "id": "w-takoyaki",
    "lemma": "たこ焼き",
    "reading_kana": "たこやき",
    "romaji": "takoyaki",
    "jlpt_level": "N5",
    "frequency_rank": 92,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ทาโกะยากิ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "た",
        "high": false
      },
      {
        "mora": "こ",
        "high": true
      },
      {
        "mora": "や",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-ramen",
    "lemma": "ラーメン",
    "reading_kana": "らーめん",
    "romaji": "raamen",
    "jlpt_level": "N5",
    "frequency_rank": 93,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ราเมน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ら",
        "high": false
      },
      {
        "mora": "ー",
        "high": true
      },
      {
        "mora": "め",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-kanpai",
    "lemma": "乾杯",
    "reading_kana": "かんぱい",
    "romaji": "kanpai",
    "jlpt_level": "N5",
    "frequency_rank": 94,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ชนแก้ว/ไชโย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "ぱ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-maccha",
    "lemma": "抹茶",
    "reading_kana": "まっちゃ",
    "romaji": "matcha",
    "jlpt_level": "N4",
    "frequency_rank": 95,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ชาเขียวมัทฉะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ま",
        "high": false
      },
      {
        "mora": "っ",
        "high": true
      },
      {
        "mora": "ち",
        "high": true
      },
      {
        "mora": "ゃ",
        "high": true
      }
    ]
  },
  {
    "id": "w-kafe",
    "lemma": "カフェ",
    "reading_kana": "かふぇ",
    "romaji": "kafe",
    "jlpt_level": "N5",
    "frequency_rank": 25,
    "part_of_speech": "Noun",
    "core_meanings": [
      "คาเฟ่"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "ふ",
        "high": true
      },
      {
        "mora": "ぇ",
        "high": true
      }
    ]
  },
  {
    "id": "w-lemon",
    "lemma": "レモン",
    "reading_kana": "れもん",
    "romaji": "remon",
    "jlpt_level": "N5",
    "frequency_rank": 96,
    "part_of_speech": "Noun",
    "core_meanings": [
      "มะนาวเลมอน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "れ",
        "high": false
      },
      {
        "mora": "も",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-pokemon",
    "lemma": "ポケモン",
    "reading_kana": "ぽけもん",
    "romaji": "pokemon",
    "jlpt_level": "N5",
    "frequency_rank": 20,
    "part_of_speech": "Noun",
    "core_meanings": [
      "โปเกมอน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ぽ",
        "high": false
      },
      {
        "mora": "け",
        "high": true
      },
      {
        "mora": "も",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      }
    ]
  },
  {
    "id": "w-noroi",
    "lemma": "呪い",
    "reading_kana": "のろい",
    "romaji": "noroi",
    "jlpt_level": "N4",
    "frequency_rank": 97,
    "part_of_speech": "Noun",
    "core_meanings": [
      "คำสาป"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "の",
        "high": false
      },
      {
        "mora": "ろ",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-jujutsu",
    "lemma": "呪術",
    "reading_kana": "じゅじゅつ",
    "romaji": "jujutsu",
    "jlpt_level": "N3",
    "frequency_rank": 98,
    "part_of_speech": "Noun",
    "core_meanings": [
      "คุณไสย",
      "ไสยเวท"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "じ",
        "high": false
      },
      {
        "mora": "ゅ",
        "high": true
      },
      {
        "mora": "じ",
        "high": true
      },
      {
        "mora": "ゅ",
        "high": true
      },
      {
        "mora": "つ",
        "high": true
      }
    ]
  },
  {
    "id": "w-ryouiki",
    "lemma": "領域展開",
    "reading_kana": "りょういきてんかい",
    "romaji": "ryouikitenkai",
    "jlpt_level": "N3",
    "frequency_rank": 99,
    "part_of_speech": "Noun",
    "core_meanings": [
      "การกางอาณาเขต"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "り",
        "high": false
      },
      {
        "mora": "ょ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "て",
        "high": true
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-akuma",
    "lemma": "悪魔",
    "reading_kana": "あくま",
    "romaji": "akuma",
    "jlpt_level": "N3",
    "frequency_rank": 100,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ปีศาจ",
      "ซาตาน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "あ",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      },
      {
        "mora": "ま",
        "high": true
      }
    ]
  },
  {
    "id": "w-shinigami",
    "lemma": "死神",
    "reading_kana": "しにがみ",
    "romaji": "shinigami",
    "jlpt_level": "N4",
    "frequency_rank": 101,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ยมทูต",
      "เทพมรณะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "し",
        "high": false
      },
      {
        "mora": "に",
        "high": true
      },
      {
        "mora": "が",
        "high": true
      },
      {
        "mora": "み",
        "high": true
      }
    ]
  },
  {
    "id": "w-bankai",
    "lemma": "卍解",
    "reading_kana": "ばんかい",
    "romaji": "bankai",
    "jlpt_level": "N3",
    "frequency_rank": 102,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ปลดปล่อยสวัสดิกะ (บังไค)"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ば",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-chikara",
    "lemma": "力",
    "reading_kana": "ちから",
    "romaji": "chikara",
    "jlpt_level": "N5",
    "frequency_rank": 103,
    "part_of_speech": "Noun",
    "core_meanings": [
      "พลัง",
      "กำลัง"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ち",
        "high": false
      },
      {
        "mora": "か",
        "high": true
      },
      {
        "mora": "ら",
        "high": true
      }
    ]
  },
  {
    "id": "w-yuuki",
    "lemma": "勇気",
    "reading_kana": "ゆうき",
    "romaji": "yuuki",
    "jlpt_level": "N4",
    "frequency_rank": 104,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ความกล้าหาญ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ゆ",
        "high": false
      },
      {
        "mora": "う",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-kakugo",
    "lemma": "覚悟",
    "reading_kana": "かくご",
    "romaji": "kakugo",
    "jlpt_level": "N3",
    "frequency_rank": 105,
    "part_of_speech": "Noun",
    "core_meanings": [
      "การเตรียมใจ",
      "ปณิธาน"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "か",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      },
      {
        "mora": "ご",
        "high": true
      }
    ]
  },
  {
    "id": "w-yakusoku",
    "lemma": "約束",
    "reading_kana": "やくそく",
    "romaji": "yakusoku",
    "jlpt_level": "N5",
    "frequency_rank": 106,
    "part_of_speech": "Noun",
    "core_meanings": [
      "สัญญา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "や",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      },
      {
        "mora": "そ",
        "high": true
      },
      {
        "mora": "く",
        "high": true
      }
    ]
  },
  {
    "id": "w-unmei",
    "lemma": "運命",
    "reading_kana": "うんめい",
    "romaji": "unmei",
    "jlpt_level": "N3",
    "frequency_rank": 107,
    "part_of_speech": "Noun",
    "core_meanings": [
      "โชคชะตา"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "う",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "め",
        "high": true
      },
      {
        "mora": "い",
        "high": true
      }
    ]
  },
  {
    "id": "w-kiseki",
    "lemma": "奇跡",
    "reading_kana": "きせき",
    "romaji": "kiseki",
    "jlpt_level": "N3",
    "frequency_rank": 108,
    "part_of_speech": "Noun",
    "core_meanings": [
      "ปาฏิหาริย์"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "き",
        "high": false
      },
      {
        "mora": "せ",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      }
    ]
  },
  {
    "id": "w-saikyou",
    "lemma": "最強",
    "reading_kana": "さいきょう",
    "romaji": "saikyou",
    "jlpt_level": "N3",
    "frequency_rank": 109,
    "part_of_speech": "Noun",
    "core_meanings": [
      "แข็งแกร่งที่สุด"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "さ",
        "high": false
      },
      {
        "mora": "い",
        "high": true
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "ょ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-itadori",
    "lemma": "虎杖",
    "reading_kana": "いたどり",
    "romaji": "itadori",
    "jlpt_level": "N4",
    "frequency_rank": 110,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "อิตาโดริ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "た",
        "high": true
      },
      {
        "mora": "ど",
        "high": true
      },
      {
        "mora": "り",
        "high": true
      }
    ]
  },
  {
    "id": "w-sukuna",
    "lemma": "宿儺",
    "reading_kana": "すくな",
    "romaji": "sukuna",
    "jlpt_level": "N3",
    "frequency_rank": 111,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "สุคุนะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "す",
        "high": false
      },
      {
        "mora": "く",
        "high": true
      },
      {
        "mora": "な",
        "high": true
      }
    ]
  },
  {
    "id": "w-gojou",
    "lemma": "五条",
    "reading_kana": "ごじょう",
    "romaji": "gojou",
    "jlpt_level": "N4",
    "frequency_rank": 112,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "โกโจ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ご",
        "high": false
      },
      {
        "mora": "じ",
        "high": true
      },
      {
        "mora": "ょ",
        "high": true
      },
      {
        "mora": "う",
        "high": true
      }
    ]
  },
  {
    "id": "w-fushiguro",
    "lemma": "伏黒",
    "reading_kana": "ふしぐろ",
    "romaji": "fushiguro",
    "jlpt_level": "N4",
    "frequency_rank": 113,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "ฟุชิงุโระ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ふ",
        "high": false
      },
      {
        "mora": "し",
        "high": true
      },
      {
        "mora": "ぐ",
        "high": true
      },
      {
        "mora": "ろ",
        "high": true
      }
    ]
  },
  {
    "id": "w-ichigo",
    "lemma": "一護",
    "reading_kana": "いちご",
    "romaji": "ichigo",
    "jlpt_level": "N4",
    "frequency_rank": 114,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "อิจิโกะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "ち",
        "high": true
      },
      {
        "mora": "ご",
        "high": true
      }
    ]
  },
  {
    "id": "w-rukia",
    "lemma": "ルキア",
    "reading_kana": "るきあ",
    "romaji": "rukia",
    "jlpt_level": "N4",
    "frequency_rank": 115,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "ลูเคีย"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "る",
        "high": false
      },
      {
        "mora": "き",
        "high": true
      },
      {
        "mora": "あ",
        "high": true
      }
    ]
  },
  {
    "id": "w-denji",
    "lemma": "デンジ",
    "reading_kana": "でんじ",
    "romaji": "denji",
    "jlpt_level": "N4",
    "frequency_rank": 116,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "เดนจิ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "で",
        "high": false
      },
      {
        "mora": "ん",
        "high": true
      },
      {
        "mora": "じ",
        "high": true
      }
    ]
  },
  {
    "id": "w-pochita",
    "lemma": "ポチタ",
    "reading_kana": "ぽちた",
    "romaji": "pochita",
    "jlpt_level": "N4",
    "frequency_rank": 117,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "โพชิตะ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "ぽ",
        "high": false
      },
      {
        "mora": "ち",
        "high": true
      },
      {
        "mora": "た",
        "high": true
      }
    ]
  },
  {
    "id": "w-isagi",
    "lemma": "潔",
    "reading_kana": "いさぎ",
    "romaji": "isagi",
    "jlpt_level": "N4",
    "frequency_rank": 118,
    "part_of_speech": "Proper Noun",
    "core_meanings": [
      "อิซางิ"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "い",
        "high": false
      },
      {
        "mora": "さ",
        "high": true
      },
      {
        "mora": "ぎ",
        "high": true
      }
    ]
  },
  {
    "id": "w-ego",
    "lemma": "エゴ",
    "reading_kana": "えご",
    "romaji": "ego",
    "jlpt_level": "N3",
    "frequency_rank": 119,
    "part_of_speech": "Noun",
    "core_meanings": [
      "อีโก้"
    ],
    "pitch_accent": "LHH",
    "pitch_morae": [
      {
        "mora": "え",
        "high": false
      },
      {
        "mora": "ご",
        "high": true
      }
    ]
  }
];

export const MOCK_VIDEOS: VideoRecord[] = [
  {
    "id": "vid-anione-jjk-01",
    "youtube_id": "miiLadou1cw",
    "title": "Jujutsu Kaisen EP 1: Ryomen Sukuna (Ani-One Asia)",
    "japanese_title": "【呪術廻戦】第1話 両面宿儺！特級呪物を喰らう (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 45,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 1435,
    "thumbnail_gradient": "from-purple-900 via-indigo-950 to-slate-900",
    "scene_emoji": "⚔️",
    "description": "Official licensed anime from Ani-One Asia: Yuji Itadori encounters Megumi Fushiguro and swallows the cursed finger of Ryomen Sukuna."
  },
  {
    "id": "vid-anione-jjk-02",
    "youtube_id": "YKnowHCkAA8",
    "title": "Jujutsu Kaisen EP 2: Satoru Gojo (Ani-One Asia)",
    "japanese_title": "【呪術廻戦】第2話 最強の呪術師・五条悟登場！(Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 50,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 1435,
    "thumbnail_gradient": "from-blue-900 via-indigo-900 to-slate-900",
    "scene_emoji": "🤞",
    "description": "Official licensed anime from Ani-One Asia: Satoru Gojo effortlessly handles Sukuna and introduces Yuji to the world of Jujutsu Sorcery."
  },
  {
    "id": "vid-anione-bleach-01",
    "youtube_id": "OgyORlzV0uw",
    "title": "BLEACH EP 1: The Day I Became a Shinigami (Ani-One Asia)",
    "japanese_title": "【BLEACH 死神】第1話 死神になっちゃった日！朽木ルキアとの出会い (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 45,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 1380,
    "thumbnail_gradient": "from-orange-950 via-red-950 to-slate-900",
    "scene_emoji": "🗡️",
    "description": "Official classic anime from Ani-One Asia: Ichigo Kurosaki encounters Soul Reaper Rukia Kuchiki and awakens his dormant spirit power."
  },
  {
    "id": "vid-n4-lemon",
    "youtube_id": "SX_ViT4Ra7k",
    "title": "Lemon - Kenshi Yonezu: Learn Japanese Through Music (N4)",
    "japanese_title": "米津玄師 - Lemon で学ぶ日本語！胸に響く歌詞の世界 (N4)",
    "channel": "J-Pop Japanese",
    "category": "J-Pop",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 45,
      "N4": 45,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 274,
    "thumbnail_gradient": "from-amber-500 via-yellow-600 to-stone-900",
    "scene_emoji": "🎵",
    "description": "Study emotional grammar patterns and expressive vocabulary through the masterpiece Lemon by Kenshi Yonezu."
  },
  {
    "id": "vid-anione-aoashi-s2-01",
    "youtube_id": "LW5jN9YvoO0",
    "title": "อาโอะอาชิ ซีซั่น 2 ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【アオアシ】2nd シーズン 第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 68,
      "N4": 30,
      "N3": 2,
      "N2": 0,
      "N1": 0
    },
    "duration": 1470,
    "thumbnail_gradient": "from-green-900 via-emerald-950 to-slate-900",
    "scene_emoji": "⚽",
    "description": "ตัวเอกย้ายจากเอฮิเมะเข้าร่วมทีมเยาวชนของสโมสรฟุตบอลในโตเกียว และต้องฝ่าการแข่งขันที่เข้มข้น"
  },
  {
    "id": "vid-anione-battlespirits-01",
    "youtube_id": "3umS7qVj2kg",
    "title": "แบทเทิลสปิริตส์ [Re] ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "Battle Spirits [Re] ZEKKAI NO KU",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 61,
      "N4": 38,
      "N3": 1,
      "N2": 0,
      "N1": 0
    },
    "duration": 1426,
    "thumbnail_gradient": "from-sky-900 via-blue-950 to-slate-900",
    "scene_emoji": "🎴",
    "description": "เรื่องราวในยุคบากูมัตสึของญี่ปุ่น ที่มีการดวลบัตร Battle Spirits แบบ Eternal ของซามูไรและแบบ Standard Battle ของสามัญชน"
  },
  {
    "id": "vid-anione-darkmachine-01",
    "youtube_id": "UqTNGEKXrRI",
    "title": "ดาร์กแมชชีน ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【DARK MACHINE】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 69,
      "N4": 31,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1370,
    "thumbnail_gradient": "from-neutral-900 via-stone-950 to-slate-900",
    "scene_emoji": "🌑",
    "description": "ตัวเอกชื่อไคริได้รับคำสั่งจากปู่ให้ไปตามหาผู้เล่น DARK MACHINE ที่เมืองโคงาเนะทานิ ซึ่งเศรษฐกิจผูกอยู่กับเกมนี้"
  },
  {
    "id": "vid-anione-kurumi-01",
    "youtube_id": "LKiQ70L4IGQ",
    "title": "FX ไฟเตอร์ คุรุมิจัง ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "FX戦士くるみちゃん",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 94,
      "N4": 6,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1425,
    "thumbnail_gradient": "from-pink-700 via-rose-900 to-slate-900",
    "scene_emoji": "🎀",
    "description": "นักศึกษาชื่อคุรุมิเริ่มอาชีพเทรด FX ตามเป้าหมายของเธอ (เรื่องแต่งทั้งหมด ไม่ใช่คำแนะนำการลงทุน)"
  },
  {
    "id": "vid-anione-rayearth-01",
    "youtube_id": "t0rFFd8BtvA",
    "title": "เมจิกไนท์ เรย์เอิร์ธ ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【魔法騎士レイアース】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 77,
      "N4": 23,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1404,
    "thumbnail_gradient": "from-fuchsia-800 via-violet-950 to-slate-900",
    "scene_emoji": "🧙",
    "description": "ฮิคารุ อุมิ และฟู สามสาวนักเรียนถูกเรียกตัวไปยังโลกต่างมิติ เซเฟียโร เพื่อช่วยกอบกู้โลกและเจ้าหญิง"
  },
  {
    "id": "vid-anione-mgrp-01",
    "youtube_id": "lHAh8nfXB1k",
    "title": "แผนพัฒนาสาวน้อยเวทมนตร์ รีสตาร์ท ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【魔法少女育成計画 restart】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 80,
      "N4": 20,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1430,
    "thumbnail_gradient": "from-rose-800 via-purple-950 to-slate-900",
    "scene_emoji": "🔮",
    "description": "เบ็ตติกาและเด็กสาวเวทมนตร์อีกหลายคนถูกบังคับเข้าร่วมเกมจำลองลึกลับที่ซ่อนอันตรายไว้"
  },
  {
    "id": "vid-anione-sword-s2-01",
    "youtube_id": "XCzVymkR5sE",
    "title": "เกิดใหม่เป็นดาบ ซีซั่น 2 ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【転生したら剣でした】第2期 第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 78,
      "N4": 22,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1420,
    "thumbnail_gradient": "from-slate-700 via-slate-900 to-zinc-950",
    "scene_emoji": "🗡️",
    "description": "ฟลัน สาวเผ่าแมวดำที่เคยถูกกดขี่ ฝึกวิชากับดาบอัจฉริยะ และออกผจญภัยในสมาคมนักผจญภัย"
  },
  {
    "id": "vid-anione-goblin-01",
    "youtube_id": "9mBa-f8ZPQ4",
    "title": "เกิดใหม่เป็นก็อบลิน ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【転生ゴブリンだけど質問ある？】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 72,
      "N4": 28,
      "N3": 0,
      "N2": 0,
      "N1": 0
    },
    "duration": 1420,
    "thumbnail_gradient": "from-lime-900 via-green-950 to-slate-900",
    "scene_emoji": "👺",
    "description": "ยากามิ อากิระ พนักงานบริษัทที่เสียชีวิตขณะช่วยเด็ก เกิดใหม่เป็นก็อบลินและสืบทอดสกิลจากก็อบลินที่จากไป"
  },
  {
    "id": "vid-anione-codegeass-01",
    "youtube_id": "NZyO-FFwmHE",
    "title": "โค้ดกีอัส ภาคการปฏิวัติของลูลูช ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "コードギアス 反逆のルルーシュ",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 35,
      "N3": 35,
      "N2": 15,
      "N1": 0
    },
    "duration": 1448,
    "thumbnail_gradient": "from-purple-950 via-red-950 to-slate-900",
    "scene_emoji": "♟️",
    "description": "ตอนที่ 1 (วันที่ปีศาจตนใหม่ถือกำเนิด) ของ Code Geass: Lelouch of the Rebellion ฉบับทางการจาก Ani-One Asia (เสียงญี่ปุ่น)"
  },
  {
    "id": "vid-anione-codegeass-02",
    "youtube_id": "U7VDDvGEwdA",
    "title": "โค้ดกีอัส ภาคการปฏิวัติของลูลูช ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "コードギアス 反逆のルルーシュ",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 35,
      "N3": 35,
      "N2": 15,
      "N1": 0
    },
    "duration": 1448,
    "thumbnail_gradient": "from-purple-950 via-red-950 to-slate-900",
    "scene_emoji": "♟️",
    "description": "ตอนที่ 2 (อัศวินขาวตื่นขึ้น) ของ Code Geass: Lelouch of the Rebellion ฉบับทางการจาก Ani-One Asia (เสียงญี่ปุ่น)"
  },
  {
    "id": "vid-anione-codegeass-03",
    "youtube_id": "jVywpPb1TLE",
    "title": "โค้ดกีอัส ภาคการปฏิวัติของลูลูช ตอนที่ 3 (Ani-One Asia)",
    "japanese_title": "コードギアス 反逆のルルーシュ",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 35,
      "N3": 35,
      "N2": 15,
      "N1": 0
    },
    "duration": 1448,
    "thumbnail_gradient": "from-purple-950 via-red-950 to-slate-900",
    "scene_emoji": "♟️",
    "description": "ตอนที่ 3 (เพื่อนร่วมชั้นปลอมตัว) ของ Code Geass: Lelouch of the Rebellion ฉบับทางการจาก Ani-One Asia (เสียงญี่ปุ่น)"
  }
];

export const MOCK_SUBTITLE_LINES: Record<string, SubtitleLineRecord[]> = {
  "vid-anione-jjk-01": [
    {
      "id": "sub-jjk01-01",
      "video_id": "vid-anione-jjk-01",
      "line_index": 0,
      "start_time_ms": 0,
      "end_time_ms": 6500,
      "speaker": "伏黒恵 (Megumi)",
      "raw_text": "おい、そこの特級呪物を渡せ！それは危険すぎる！",
      "natural_translation": "Hey, hand over that special grade cursed object! It is way too dangerous!",
      "thai_translation": "เฮ้ย! ส่งวัตถุต้องสาประดับพิเศษชิ้นนั้นมาเดี๋ยวนี้! มันอันตรายเกินไป!",
      "ai_grammar_summary": "〜を渡せ = รูปคำสั่งเด็ดขาด (Imperative) / すぎる = เกินขอบเขต",
      "tokens_json": [
        {
          "surface": "おい",
          "word_id": "w-oi",
          "lemma": "おい",
          "reading_kana": "おい",
          "romaji": "oi",
          "jlpt_level": "N5",
          "part_of_speech": "Interjection",
          "contextual_meaning": "hey",
          "thai_meaning": "เฮ้ย"
        },
        {
          "surface": "そこの",
          "word_id": "w-soko",
          "lemma": "そこ",
          "reading_kana": "そこの",
          "romaji": "soko no",
          "jlpt_level": "N5",
          "part_of_speech": "Pronoun",
          "contextual_meaning": "that over there",
          "thai_meaning": "ตรงนั้น"
        },
        {
          "surface": "特級呪物",
          "word_id": "w-noroi",
          "lemma": "呪い",
          "reading_kana": "とっきゅうじゅぶつ",
          "romaji": "tokkyuu jubutsu",
          "jlpt_level": "N3",
          "part_of_speech": "Noun",
          "contextual_meaning": "special grade cursed object",
          "thai_meaning": "วัตถุต้องสาประดับพิเศษ"
        },
        {
          "surface": "渡せ",
          "word_id": "w-watase",
          "lemma": "渡す",
          "reading_kana": "わたせ",
          "romaji": "watase",
          "jlpt_level": "N4",
          "part_of_speech": "Verb (Imperative)",
          "contextual_meaning": "hand it over",
          "thai_meaning": "ส่งมา"
        },
        {
          "surface": "危険すぎる",
          "word_id": "w-kikensugiru",
          "lemma": "危険",
          "reading_kana": "きけんすぎる",
          "romaji": "kiken sugiru",
          "jlpt_level": "N4",
          "part_of_speech": "Adjective + Verb",
          "contextual_meaning": "too dangerous",
          "thai_meaning": "อันตรายเกินไป"
        }
      ]
    },
    {
      "id": "sub-jjk01-02",
      "video_id": "vid-anione-jjk-01",
      "line_index": 1,
      "start_time_ms": 6600,
      "end_time_ms": 13500,
      "speaker": "虎杖悠仁 (Yuji)",
      "raw_text": "みんなを助けるためなら、俺は呪いだって喰ってやる！",
      "natural_translation": "If it is to save everyone, I will even eat this curse!",
      "thai_translation": "ถ้าเพื่อช่วยทุกคนล่ะก็ ต่อให้เป็นคำสาปฉันก็จะกลืนกินมันเข้าไป!",
      "ai_grammar_summary": "〜ためなら = ถ้าเพื่อการนั้น... / 〜だって = แม้กระทั่ง / 〜てやる = แสดงความมุ่งมั่นลงมือทำ",
      "tokens_json": [
        {
          "surface": "みんなを",
          "word_id": "w-minna",
          "lemma": "みんな",
          "reading_kana": "みんなを",
          "romaji": "minna o",
          "jlpt_level": "N5",
          "part_of_speech": "Noun + Particle",
          "contextual_meaning": "everyone",
          "thai_meaning": "ทุกคน"
        },
        {
          "surface": "助けるためなら",
          "word_id": "w-tasukeru",
          "lemma": "助ける",
          "reading_kana": "たすけるためなら",
          "romaji": "tasukeru tame nara",
          "jlpt_level": "N4",
          "part_of_speech": "Verb + Grammar",
          "contextual_meaning": "if it is to save",
          "thai_meaning": "ถ้าเพื่อช่วย"
        },
        {
          "surface": "俺は",
          "word_id": "w-ore",
          "lemma": "俺",
          "reading_kana": "おれは",
          "romaji": "ore wa",
          "jlpt_level": "N4",
          "part_of_speech": "Pronoun",
          "contextual_meaning": "I",
          "thai_meaning": "ฉัน/ข้า"
        },
        {
          "surface": "呪いだって",
          "word_id": "w-noroi",
          "lemma": "呪い",
          "reading_kana": "のろいだって",
          "romaji": "noroi datte",
          "jlpt_level": "N4",
          "part_of_speech": "Noun + Particle",
          "contextual_meaning": "even a curse",
          "thai_meaning": "แม้แต่คำสาป"
        },
        {
          "surface": "喰ってやる",
          "word_id": "w-taberu",
          "lemma": "食べる",
          "reading_kana": "くってやる",
          "romaji": "kutte yaru",
          "jlpt_level": "N4",
          "part_of_speech": "Verb phrase",
          "contextual_meaning": "I will devour it",
          "thai_meaning": "จะสวาปามกินเข้าไป!"
        }
      ]
    },
    {
      "id": "sub-jjk01-03",
      "video_id": "vid-anione-jjk-01",
      "line_index": 2,
      "start_time_ms": 13600,
      "end_time_ms": 22000,
      "speaker": "両面宿儺 (Sukuna)",
      "raw_text": "ハハハ！光だ！呪霊の肉など味気ないと思っていたところだ！",
      "natural_translation": "Hahaha! Light at last! Just when I was thinking cursed spirits flesh was tasteless!",
      "thai_translation": "ฮ่าๆๆ! แสงสว่าง! กำลังคิดอยู่พอดีเลยว่าเนื้อของพวกวิญญาณคำสาปมันจืดชืดไร้รสชาติสิ้นดี!",
      "ai_grammar_summary": "光だ = เป็นแสงสว่าง / 〜と思っていたところだ = กำลังคิดเช่นนั้นอยู่พอดี",
      "tokens_json": [
        {
          "surface": "光だ",
          "word_id": "w-hikari",
          "lemma": "光",
          "reading_kana": "ひかりだ",
          "romaji": "hikari da",
          "jlpt_level": "N4",
          "part_of_speech": "Noun + Copula",
          "contextual_meaning": "it is light",
          "thai_meaning": "แสงสว่าง!"
        },
        {
          "surface": "呪霊の",
          "word_id": "w-noroi",
          "lemma": "呪い",
          "reading_kana": "じゅれいの",
          "romaji": "jurei no",
          "jlpt_level": "N3",
          "part_of_speech": "Noun",
          "contextual_meaning": "cursed spirit’s",
          "thai_meaning": "ของวิญญาณคำสาป"
        },
        {
          "surface": "味気ない",
          "word_id": "w-ajikenai",
          "lemma": "味気ない",
          "reading_kana": "あじけない",
          "romaji": "ajikenai",
          "jlpt_level": "N2",
          "part_of_speech": "I-Adjective",
          "contextual_meaning": "bland / dull",
          "thai_meaning": "จืดชืดไร้รสชาติ"
        },
        {
          "surface": "思っていたところだ",
          "word_id": "w-omou",
          "lemma": "思う",
          "reading_kana": "おもっていたところだ",
          "romaji": "omotte ita tokoro da",
          "jlpt_level": "N3",
          "part_of_speech": "Grammar",
          "contextual_meaning": "was just thinking so",
          "thai_meaning": "กำลังคิดอยู่พอดี"
        }
      ]
    }
  ],
  "vid-anione-jjk-02": [
    {
      "id": "sub-jjk02-01",
      "video_id": "vid-anione-jjk-02",
      "line_index": 0,
      "start_time_ms": 0,
      "end_time_ms": 6000,
      "speaker": "五条悟 (Gojo Satoru)",
      "raw_text": "大丈夫！僕、最強だから。ちょっと見学しててね。",
      "natural_translation": "No worries! Because I am the strongest. Just sit back and watch for a bit.",
      "thai_translation": "ไม่ต้องห่วง! เพราะผมน่ะ แข็งแกร่งที่สุด ยืนดูอยู่เฉยๆ แป๊บหนึ่งนะ",
      "ai_grammar_summary": "大丈夫 = ไม่เป็นไร / 〜だから = เพราะว่า... / 〜ててね = ช่วยทำสิ่งนั้นรอไว้หน่อยนะ",
      "tokens_json": [
        {
          "surface": "大丈夫",
          "word_id": "w-daijoubu",
          "lemma": "大丈夫",
          "reading_kana": "だいじょうぶ",
          "romaji": "daijoubu",
          "jlpt_level": "N5",
          "part_of_speech": "Na-Adjective",
          "contextual_meaning": "it is alright",
          "thai_meaning": "ไม่ต้องห่วง / สบายมาก"
        },
        {
          "surface": "僕",
          "word_id": "w-boku",
          "lemma": "僕",
          "reading_kana": "ぼく",
          "romaji": "boku",
          "jlpt_level": "N5",
          "part_of_speech": "Pronoun",
          "contextual_meaning": "I",
          "thai_meaning": "ผม"
        },
        {
          "surface": "最強だから",
          "word_id": "w-saikyou",
          "lemma": "最強",
          "reading_kana": "さいきょうだから",
          "romaji": "saikyou dakara",
          "jlpt_level": "N3",
          "part_of_speech": "Noun + Particle",
          "contextual_meaning": "because I am the strongest",
          "thai_meaning": "เพราะแข็งแกร่งที่สุด"
        },
        {
          "surface": "見学しててね",
          "word_id": "w-kengaku",
          "lemma": "見学",
          "reading_kana": "けんがくしててね",
          "romaji": "kengaku shitete ne",
          "jlpt_level": "N4",
          "part_of_speech": "Verb phrase",
          "contextual_meaning": "just watch closely",
          "thai_meaning": "ยืนดูเป็นพยานหน่อยนะ"
        }
      ]
    },
    {
      "id": "sub-jjk02-02",
      "video_id": "vid-anione-jjk-02",
      "line_index": 1,
      "start_time_ms": 6100,
      "end_time_ms": 12500,
      "speaker": "五条悟 (Gojo Satoru)",
      "raw_text": "呪術高専へようこそ！仲間と一緒に、正しい死を導こう。",
      "natural_translation": "Welcome to Jujutsu High! Together with your comrades, let us guide people to proper deaths.",
      "thai_translation": "ยินดีต้อนรับสู่โรงเรียนไสยเวท! มาร่วมมือกับพวกพ้อง นำพาผู้คนสู่ความตายที่ถูกต้องกันเถอะ",
      "ai_grammar_summary": "〜へようこそ = ยินดีต้อนรับสู่... / 〜と一緒に = ร่วมกับ... / 〜こう = รูปชักชวน (Volitional)",
      "tokens_json": [
        {
          "surface": "呪術高専へようこそ",
          "word_id": "w-jujutsu",
          "lemma": "呪術",
          "reading_kana": "じゅじゅつこうせんへようこそ",
          "romaji": "jujutsu kousen e youkoso",
          "jlpt_level": "N4",
          "part_of_speech": "Phrase",
          "contextual_meaning": "welcome to jujutsu high",
          "thai_meaning": "ยินดีต้อนรับสู่โรงเรียนไสยเวท"
        },
        {
          "surface": "仲間と一緒に",
          "word_id": "w-nakama",
          "lemma": "仲間",
          "reading_kana": "なかまといっしょに",
          "romaji": "nakama to issho ni",
          "jlpt_level": "N4",
          "part_of_speech": "Noun phrase",
          "contextual_meaning": "together with comrades",
          "thai_meaning": "ร่วมกับพวกพ้อง"
        },
        {
          "surface": "正しい",
          "word_id": "w-tadashii",
          "lemma": "正しい",
          "reading_kana": "ただしい",
          "romaji": "tadashii",
          "jlpt_level": "N4",
          "part_of_speech": "I-Adjective",
          "contextual_meaning": "correct / proper",
          "thai_meaning": "ที่ถูกต้องสมควร"
        },
        {
          "surface": "導こう",
          "word_id": "w-michibiku",
          "lemma": "導く",
          "reading_kana": "みちびこう",
          "romaji": "michibikou",
          "jlpt_level": "N3",
          "part_of_speech": "Verb (Volitional)",
          "contextual_meaning": "let us guide",
          "thai_meaning": "จงนำพาเถิด"
        }
      ]
    }
  ],
  "vid-anione-bleach-01": [
    {
      "id": "sub-bleach-01",
      "video_id": "vid-anione-bleach-01",
      "line_index": 0,
      "start_time_ms": 0,
      "end_time_ms": 7000,
      "speaker": "黒崎一護 (Ichigo)",
      "raw_text": "俺の名前は黒崎一護！幽霊が見えるだけの普通の高校生だ！",
      "natural_translation": "My name is Ichigo Kurosaki! Just a regular high schooler who happens to see ghosts!",
      "thai_translation": "ฉันชื่อคุโรซากิ อิจิโกะ! เป็นแค่นักเรียนม.ปลายธรรมดาที่บังเอิญมองเห็นวิญญาณได้เท่านั้นเอง!",
      "ai_grammar_summary": "〜の名前は = ชื่อของฉันคือ... / 〜だけの = แค่...เท่านั้น",
      "tokens_json": [
        {
          "surface": "俺の名前は",
          "word_id": "w-ore",
          "lemma": "俺",
          "reading_kana": "おれのなまえは",
          "romaji": "ore no namae wa",
          "jlpt_level": "N5",
          "part_of_speech": "Phrase",
          "contextual_meaning": "my name is",
          "thai_meaning": "ชื่อของฉันคือ"
        },
        {
          "surface": "黒崎一護",
          "word_id": "w-ichigo",
          "lemma": "一護",
          "reading_kana": "くろさきいちご",
          "romaji": "kurosaki ichigo",
          "jlpt_level": "N4",
          "part_of_speech": "Proper Noun",
          "contextual_meaning": "Ichigo Kurosaki",
          "thai_meaning": "คุโรซากิ อิจิโกะ"
        },
        {
          "surface": "見えるだけの",
          "word_id": "w-miru",
          "lemma": "見る",
          "reading_kana": "みえるだけの",
          "romaji": "mieru dake no",
          "jlpt_level": "N4",
          "part_of_speech": "Verb + Particle",
          "contextual_meaning": "just being able to see",
          "thai_meaning": "แค่พอมองเห็นได้"
        },
        {
          "surface": "高校生だ",
          "word_id": "w-gakusei",
          "lemma": "学生",
          "reading_kana": "こうこうせいだ",
          "romaji": "koukousei da",
          "jlpt_level": "N5",
          "part_of_speech": "Noun + Copula",
          "contextual_meaning": "am a high school student",
          "thai_meaning": "เป็นเด็กม.ปลาย"
        }
      ]
    },
    {
      "id": "sub-bleach-02",
      "video_id": "vid-anione-bleach-01",
      "line_index": 1,
      "start_time_ms": 7100,
      "end_time_ms": 14000,
      "speaker": "朽木ルキア (Rukia)",
      "raw_text": "貴様、なぜ我が姿が見える！？私は尸魂界から来た死神だ！",
      "natural_translation": "You, how can you see my form!? I am a Soul Reaper from the Soul Society!",
      "thai_translation": "เจ้ามนุษย์ ทำไมเจ้าถึงมองเห็นร่างของข้าได้!? ข้าคือยมทูตที่มาจากโซลโซไซตี้!",
      "ai_grammar_summary": "なぜ = ทำไม / 〜から来た = มาจากสถานที่...",
      "tokens_json": [
        {
          "surface": "貴様",
          "word_id": "w-kisama",
          "lemma": "貴様",
          "reading_kana": "きさま",
          "romaji": "kisama",
          "jlpt_level": "N3",
          "part_of_speech": "Pronoun",
          "contextual_meaning": "you (harsh)",
          "thai_meaning": "หนอย แก / เจ้า"
        },
        {
          "surface": "なぜ",
          "word_id": "w-naze",
          "lemma": "なぜ",
          "reading_kana": "なぜ",
          "romaji": "naze",
          "jlpt_level": "N5",
          "part_of_speech": "Adverb",
          "contextual_meaning": "why",
          "thai_meaning": "ทำไม"
        },
        {
          "surface": "見える",
          "word_id": "w-miru",
          "lemma": "見る",
          "reading_kana": "みえる",
          "romaji": "mieru",
          "jlpt_level": "N5",
          "part_of_speech": "Verb",
          "contextual_meaning": "can see",
          "thai_meaning": "มองเห็นได้"
        },
        {
          "surface": "死神だ",
          "word_id": "w-shinigami",
          "lemma": "死神",
          "reading_kana": "しにがみだ",
          "romaji": "shinigami da",
          "jlpt_level": "N4",
          "part_of_speech": "Noun + Copula",
          "contextual_meaning": "am a Soul Reaper",
          "thai_meaning": "คือยมทูต!"
        }
      ]
    }
  ],
  "vid-n4-lemon": [
    {
      "id": "sub-lemon-01",
      "video_id": "vid-n4-lemon",
      "line_index": 0,
      "start_time_ms": 0,
      "end_time_ms": 7000,
      "speaker": "米津玄師 (Kenshi Yonezu)",
      "raw_text": "夢ならばどれほどよかったでしょう。未だにあなたのことを夢にみる。",
      "natural_translation": "If only this were a dream, how wonderful it would have been. Even now, I still dream of you.",
      "thai_translation": "หากเรื่องทั้งหมดเป็นเพียงความฝัน มันคงจะดีสักเพียงไหนนะ... แม้กระทั่งตอนนี้ ฉันก็ยังคงฝันถึงคุณอยู่เสมอ",
      "ai_grammar_summary": "〜ならば = หากเป็นเช่นนั้น (สมมติความหวัง) / 〜にみる = ฝันเห็นถึงคนสำคัญ",
      "tokens_json": [
        {
          "surface": "夢ならば",
          "word_id": "w-yume",
          "lemma": "夢",
          "reading_kana": "ゆめならば",
          "romaji": "yume naraba",
          "jlpt_level": "N4",
          "part_of_speech": "Noun + Conditional",
          "contextual_meaning": "if it were a dream",
          "thai_meaning": "หากเป็นเพียงความฝัน"
        },
        {
          "surface": "よかったでしょう",
          "word_id": "w-ii",
          "lemma": "良い",
          "reading_kana": "よかったでしょう",
          "romaji": "yokatta deshou",
          "jlpt_level": "N5",
          "part_of_speech": "Phrase",
          "contextual_meaning": "how nice it would have been",
          "thai_meaning": "คงจะดีสักเพียงไหน"
        },
        {
          "surface": "あなたのことを",
          "word_id": "w-anata",
          "lemma": "あなた",
          "reading_kana": "あなたのことを",
          "romaji": "anata no koto o",
          "jlpt_level": "N5",
          "part_of_speech": "Pronoun phrase",
          "contextual_meaning": "about you",
          "thai_meaning": "เรื่องราวของคุณ"
        },
        {
          "surface": "夢にみる",
          "word_id": "w-miru",
          "lemma": "見る",
          "reading_kana": "ゆめにみる",
          "romaji": "yume ni miru",
          "jlpt_level": "N4",
          "part_of_speech": "Verb phrase",
          "contextual_meaning": "see in my dreams",
          "thai_meaning": "ฝันถึงอยู่ตลอด"
        }
      ]
    }
  ]
};
