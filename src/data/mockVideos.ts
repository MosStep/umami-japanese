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
  },
  {
    "id": "vid-gen-oreo-01",
    "youtube_id": "4d4vbcJy4sM",
    "title": "วล็อกเที่ยวคนเดียว: ชิมาเนะ และ ทตโตริ",
    "japanese_title": "日本VLOG｜山陰 島根、鳥取 女子一人旅｜搭寢台列車 京都-出雲 ｜山陽＆山陰地區鐵路周遊券",
    "channel": "OREO’s Vlog",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 5
    },
    "duration": 818,
    "thumbnail_gradient": "from-teal-800 via-cyan-950 to-slate-900",
    "scene_emoji": "🚃",
    "description": "วล็อกเที่ยวคนเดียวที่ชิมาเนะและทตโตริ พร้อมแชร์เส้นทาง 6 คืน 7 วัน และการใช้ตั๋วรถไฟ Sanyo-San'in Pass"
  },
  {
    "id": "vid-gen-mei-01",
    "youtube_id": "8RYAGvs1Q-0",
    "title": "วล็อกเที่ยวชนบท: มุโร่ นารา ฤดูร้อน",
    "japanese_title": "Summer escape to the Japanese countryside: Murou, #Nara 🌿 | Japan Travel Vlog",
    "channel": "Mei Time",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 5
    },
    "duration": 1082,
    "thumbnail_gradient": "from-lime-900 via-green-950 to-slate-900",
    "scene_emoji": "🌿",
    "description": "วล็อกไปเยือนหมู่บ้านชนบทมุโร่ในนารา ซึ่งผู้จัดทำบอกว่าเป็นหนึ่งในจุดโปรดของปีนี้"
  },
  {
    "id": "vid-gen-namnam-01",
    "youtube_id": "t9NicxjU4fo",
    "title": "วล็อกโตเกียว 3 คืน 4 วัน: คาเฟ่และช้อปปิ้ง",
    "japanese_title": "東京vlog🗼アラサー独身女の3泊4日ひとり旅｜雑貨とカフェ巡り☕️🥐ちいかわベーカリー｜スキズ国立ヲタ活｜吉祥寺・浅草・渋谷",
    "channel": "namnam's vlog",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 5
    },
    "duration": 1130,
    "thumbnail_gradient": "from-sky-900 via-blue-950 to-slate-900",
    "scene_emoji": "🗼",
    "description": "ทริปโตเกียว 3 คืน 4 วัน ไปอาซากายะ คิจิโจจิ อาซากุสะ และชิบูย่า พร้อมวิดีโอแพ็กกระเป๋า"
  },
  {
    "id": "vid-gen-hima-01",
    "youtube_id": "-WzINbpXbqA",
    "title": "วล็อกเกาหลี: เที่ยวโซล 1 คืน 2 วัน",
    "japanese_title": "【韓国旅Vlog】弾丸1泊2日だってちゃんと楽しいソウルの過ごし方🇰🇷",
    "channel": "HIMA HIMA CHANNEL",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 5
    },
    "duration": 859,
    "thumbnail_gradient": "from-fuchsia-800 via-violet-950 to-slate-900",
    "scene_emoji": "🇰🇷",
    "description": "วล็อกทริปสั้นที่โซล 1 คืน 2 วัน เน้นการกิน การช้อปปิ้ง และการเที่ยวในเวลาจำกัด"
  },
  {
    "id": "vid-pod-immersion-01",
    "youtube_id": "oKTHD2Wi0zU",
    "title": "พอดแคสต์ภาษาญี่ปุ่นสำหรับผู้เริ่มต้น: ฝึกพูดตาม",
    "japanese_title": "はじめての日本語【N6】日本語へようこそ！｜Shadowing for Absolute Beginners",
    "channel": "Japanese super immersion",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 30,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 1717,
    "thumbnail_gradient": "from-blue-900 via-indigo-900 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "บทฝึกพูดตาม (shadowing) สำหรับผู้เริ่มต้นสุด ๆ โดยระบุระดับในชื่อคลิปว่า N6"
  },
  {
    "id": "vid-pod-immersion-02",
    "youtube_id": "6bnE6j_bL4c",
    "title": "ฝึกฟังสนทนา: กริยา 10 คำที่ขึ้นต้นด้วย せ",
    "japanese_title": "「せ」から始まる10動詞で日本語会話【N5】Japanese Listening practice",
    "channel": "Japanese super immersion",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 30,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 1718,
    "thumbnail_gradient": "from-indigo-900 via-violet-950 to-slate-900",
    "scene_emoji": "🎧",
    "description": "ฝึกฟังสนทนาจากกริยา 10 คำที่ขึ้นต้นด้วยเสียง せ พร้อมไทม์สแตมป์ของแต่ละคำ"
  },
  {
    "id": "vid-pod-immersion-03",
    "youtube_id": "8WAo1muNsMg",
    "title": "คำนาม JLPT N4 ที่คนส่วนใหญ่มักใช้ผิด",
    "japanese_title": "90%が間違える？JLPT N4の名詞｜Most People Fail These JLPT N4 Nouns",
    "channel": "Japanese super immersion",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 50,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 1787,
    "thumbnail_gradient": "from-purple-900 via-indigo-950 to-slate-900",
    "scene_emoji": "📝",
    "description": "คำนามระดับ JLPT N4 ที่ผู้เรียนส่วนใหญ่มักทำผิด ตามหัวข้อในชื่อคลิป"
  },
  {
    "id": "vid-pod-immersion-04",
    "youtube_id": "YjUbwUcZuu0",
    "title": "ฟังเข้าใจแต่พูดไม่ได้? พอดแคสต์ระดับ N3",
    "japanese_title": "聞けるのに話せない？｜I Can Understand Japanese… But Still Can't Speak?",
    "channel": "Japanese super immersion",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 5
    },
    "duration": 1356,
    "thumbnail_gradient": "from-blue-950 via-slate-900 to-zinc-950",
    "scene_emoji": "🗣️",
    "description": "พอดแคสต์ภาษาญี่ปุ่นเรื่องการฟังเข้าใจแต่พูดไม่ออก ตามหัวข้อในชื่อคลิป"
  },
  {
    "id": "vid-pod-immersion-05",
    "youtube_id": "VNizFBWVYuk",
    "title": "เรียนมา 1 ปีแล้วทำไมยังพูดไม่ได้? (N3)",
    "japanese_title": "1年も勉強したのに話せない？｜You've Studied Japanese for 1 Year… But Still Can't Speak?",
    "channel": "Japanese super immersion",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 5
    },
    "duration": 1596,
    "thumbnail_gradient": "from-violet-900 via-purple-950 to-slate-900",
    "scene_emoji": "💬",
    "description": "พอดแคสต์ภาษาญี่ปุ่นว่าด้วยการเรียนมาหนึ่งปีแต่ยังพูดไม่ได้ ตามหัวข้อในชื่อคลิป"
  },
  {
    "id": "vid-vlog-akiko-01",
    "youtube_id": "z7mBxU12PKg",
    "title": "ฝึกฟังภาษาญี่ปุ่นระดับ N5: เรื่องราวในชีวิตประจำวันของฉัน",
    "japanese_title": "JLPT N5 Listening Practice 🇯🇵 Day in My Life | やさしい日本語",
    "channel": "Akiko_Japanese_Conversations",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 65,
      "N4": 25,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 542,
    "thumbnail_gradient": "from-rose-900 via-pink-950 to-slate-900",
    "scene_emoji": "🌸",
    "description": "ฝึกฟังภาษาญี่ปุ่นง่าย ๆ ระดับ JLPT N5 จากเรื่องเล่าชีวิตประจำวันเกี่ยวกับอาหาร คอนเสิร์ต และการวิ่ง"
  },
  {
    "id": "vid-vlog-nobu-01",
    "youtube_id": "HkGhuIqiIRI",
    "title": "วล็อกวันหยุดของวัยทำงานอายุ 24 ปี: ตื่นตี 5 ครึ่ง อ่านหนังสือ ไปคาเฟ่ และแต่งห้อง",
    "japanese_title": "vlog)5:30AMから始まる24歳社会人の休日☀️勉強・カフェ・部屋づくり🏠ひとり時間を楽しむ暮らし💖",
    "channel": "Nobu-chan",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 55,
      "N4": 35,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 1074,
    "thumbnail_gradient": "from-amber-900 via-orange-950 to-slate-900",
    "scene_emoji": "☀️",
    "description": "วล็อกวันหยุดของคนวัยทำงานอายุ 24 ปีที่เริ่มต้นตั้งแต่ 5:30 น. ด้วยการอ่านหนังสือ ไปคาเฟ่ และจัดแต่งห้องพัก"
  },
  {
    "id": "vid-pod-char-02",
    "youtube_id": "BBdK30Cvgpo",
    "title": "บทสนทนาภาษาญี่ปุ่นง่าย ๆ: ชวนเพื่อนไปเที่ยวด้วยกัน",
    "japanese_title": "Japanese Conversation \"invite a friend to join one\" / Easy Japanese Listening【N5-N4】",
    "channel": "Learn Japanese with Characters",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 30,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 511,
    "thumbnail_gradient": "from-indigo-900 via-blue-950 to-slate-900",
    "scene_emoji": "👋",
    "description": "ฝึกฟังบทสนทนาภาษาญี่ปุ่นระดับ N5-N4 เรื่องการทักทายและชวนเพื่อนออกไปข้างนอกใกล้สถานีรถไฟ"
  },
  {
    "id": "vid-pod-kensan-01",
    "youtube_id": "_aCjA73ZyF4",
    "title": "ฝึกฟังภาษาญี่ปุ่นระดับเริ่มต้น N5 แบบเข้าใจง่าย #140",
    "japanese_title": "N5 Beginner Japanese immersion! The comprehensible Japanese practice! #140",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 65,
      "N4": 25,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 1164,
    "thumbnail_gradient": "from-emerald-900 via-teal-950 to-slate-900",
    "scene_emoji": "🎧",
    "description": "ฝึกฟังภาษาญี่ปุ่นแบบ Comprehensible Input สำหรับผู้เริ่มต้นระดับ N5 เพื่อพัฒนาทักษะการฟังและการพูด"
  },
  {
    "id": "vid-vlog-nihongolearn-01",
    "youtube_id": "rjmKQ-fjnyQ",
    "title": "เรียนภาษาญี่ปุ่นในสวนสาธารณะสำหรับผู้เริ่มต้น",
    "japanese_title": "Comprehensible Japanese - Let's learn Japanese in the park!! 【Beginner】",
    "channel": "Nihongo-Learning",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 70,
      "N4": 20,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 449,
    "thumbnail_gradient": "from-green-900 via-emerald-950 to-slate-900",
    "scene_emoji": "🌳",
    "description": "คลิปฝึกฟังภาษาญี่ปุ่นแบบเข้าใจง่ายสำหรับผู้เริ่มต้นผ่านการพาเดินชมสวนสาธารณะ"
  },
  {
    "id": "vid-pod-shun-01",
    "youtube_id": "lXcXkOa5LAU",
    "title": "พอดแคสต์สนทนาภาษาญี่ปุ่นง่าย ๆ ระดับ N5 กับ OkkeiJapanese",
    "japanese_title": "【N5】Easy Japanese Conversation Podcast with @OkkeiJapanese",
    "channel": "Japanese with Shun",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 30,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 819,
    "thumbnail_gradient": "from-sky-900 via-indigo-950 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "พอดแคสต์ฝึกฟังบทสนทนาภาษาญี่ปุ่นระดับ N5 ร่วมกับช่อง OkkeiJapanese"
  },
  {
    "id": "vid-vlog-akane-01",
    "youtube_id": "yx71oF5_y1s",
    "title": "บทสนทนาภาษาญี่ปุ่นในคาเฟ่: การสั่งกาแฟ เค้ก และการคิดเงิน",
    "japanese_title": "【カフェの日本語会話】コーヒーとケーキの注文と会計",
    "channel": "あかね的日本語教室",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 55,
      "N4": 35,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 657,
    "thumbnail_gradient": "from-amber-950 via-stone-900 to-slate-950",
    "scene_emoji": "☕",
    "description": "เรียนรู้บทสนทนาภาษาญี่ปุ่นที่ใช้จริงในร้านคาเฟ่ ตั้งแต่การสั่งกาแฟและเค้กไปจนถึงการชำระเงิน"
  },
  {
    "id": "vid-vlog-sjn-01",
    "youtube_id": "ZuqUdAkYcuk",
    "title": "ไปซูเปอร์มาร์เก็ตและทำอาหารเย็น: ฝึกฟังภาษาญี่ปุ่น",
    "japanese_title": "Going to a Supermarket and Making Dinner | Japanese Listening Practice",
    "channel": "Speak Japanese Naturally",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 55,
      "N4": 35,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 1241,
    "thumbnail_gradient": "from-lime-900 via-emerald-950 to-slate-900",
    "scene_emoji": "🛒",
    "description": "ฝึกฟังภาษาญี่ปุ่นที่เป็นธรรมชาติผ่านกิจวัตรการไปซื้อของที่ซูเปอร์มาร์เก็ตและกลับมาทำมื้อเย็น"
  },
  {
    "id": "vid-food-akane-02",
    "youtube_id": "X2NmrQuuDZI",
    "title": "ทำอาหารพร้อมบรรยายเป็นภาษาญี่ปุ่น",
    "japanese_title": "日本語で料理をします",
    "channel": "あかね的日本語教室",
    "category": "Street Food",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 55,
      "N4": 35,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 941,
    "thumbnail_gradient": "from-orange-900 via-amber-950 to-slate-900",
    "scene_emoji": "🍳",
    "description": "ฝึกฟังคำศัพท์และประโยคภาษาญี่ปุ่นในชีวิตประจำวันผ่านการลงมือทำอาหาร"
  },
  {
    "id": "vid-news-abe-01",
    "youtube_id": "ZWsQB3gfBUo",
    "title": "ข่าวภาษาญี่ปุ่นเข้าใจง่าย: ถุงพลาสติกคิดเงินและผ้าฟุโรชิกิยอดนิยม",
    "japanese_title": "やさしい日本語ニュースわん　9/13「レジ袋が有料になって、代わりに使う風呂敷が人気」「オンラインゲーム、子供がする時は親が一緒にいて」「ニュース犬が好きな歌：布団の中から出たくない」",
    "channel": "阿部先生の日本語教室",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 55,
      "N4": 35,
      "N3": 10,
      "N2": 0,
      "N1": 0
    },
    "duration": 500,
    "thumbnail_gradient": "from-cyan-900 via-blue-950 to-slate-900",
    "scene_emoji": "🐶",
    "description": "ฝึกฟังข่าวภาษาญี่ปุ่นแบบเข้าใจง่ายเรื่องการใช้ผ้าฟุโรชิกิแทนถุงพลาสติกและคำแนะนำเรื่องเกมออนไลน์สำหรับเด็ก"
  },
  {
    "id": "vid-vlog-akane-03",
    "youtube_id": "oHlC4mdcTTY",
    "title": "วล็อกเดินเล่น #13: 3 สิ่งที่ควรรู้ก่อนคุยกับเจ้าของภาษาญี่ปุ่น",
    "japanese_title": "【散歩Vlog♯13】 日本語ネイティブスピーカーと話す前に知っておくべき3つのこと",
    "channel": "あかね的日本語教室",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 888,
    "thumbnail_gradient": "from-teal-900 via-cyan-950 to-slate-900",
    "scene_emoji": "🚶‍♀️",
    "description": "วล็อกเดินเล่นพร้อมแนะนำ 3 ข้อควรรู้ก่อนฝึกสนทนากับคนญี่ปุ่นเจ้าของภาษา"
  },
  {
    "id": "vid-vlog-akane-04",
    "youtube_id": "rAUdggCWMi4",
    "title": "วล็อกเดินเล่น #12: สิ่งที่อยากบอกคนที่สอบไม่ผ่าน",
    "japanese_title": "【日本語散歩Vlog♯12】不合格だった人に伝えたいこと",
    "channel": "あかね的日本語教室",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 692,
    "thumbnail_gradient": "from-indigo-900 via-slate-900 to-zinc-950",
    "scene_emoji": "🌿",
    "description": "วล็อกเดินเล่นพูดคุยให้กำลังใจและให้คำแนะนำแก่ผู้เรียนภาษาญี่ปุ่นที่สอบไม่ผ่าน"
  },
  {
    "id": "vid-vlog-sjn-02",
    "youtube_id": "Tt_9_BVXdwk",
    "title": "หนึ่งวันกับการเดินทางไปเกาะห่างไกลในญี่ปุ่น: ฝึกฟังภาษาญี่ปุ่น",
    "japanese_title": "A Day Traveling to a Remote Island in Japan | Japanese Listening Practice",
    "channel": "Speak Japanese Naturally",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 1439,
    "thumbnail_gradient": "from-sky-800 via-blue-950 to-slate-900",
    "scene_emoji": "⛴️",
    "description": "ฝึกฟังภาษาญี่ปุ่นที่เป็นธรรมชาติผ่านการเดินทางท่องเที่ยวหนึ่งวันไปยังเกาะห่างไกลในประเทศญี่ปุ่น"
  },
  {
    "id": "vid-vlog-sjn-03",
    "youtube_id": "hPvXSjQwIho",
    "title": "หนึ่งวันในกินซ่ากับชุดกิโมโน: ฝึกฟังภาษาญี่ปุ่น",
    "japanese_title": "A Day in Ginza in Kimono | Japanese Listening Practice",
    "channel": "Speak Japanese Naturally",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 50,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 1384,
    "thumbnail_gradient": "from-rose-900 via-purple-950 to-slate-900",
    "scene_emoji": "👘",
    "description": "ฝึกฟังภาษาญี่ปุ่นผ่านการสวมชุดกิโมโนเดินชมย่านกินซ่าและสัมผัสวัฒนธรรมอาหารญี่ปุ่น"
  },
  {
    "id": "vid-pod-dailypod-01",
    "youtube_id": "x-KklMb9FAw",
    "title": "คุยเรื่องอาหารเช้าของคนญี่ปุ่น: พอดแคสต์ภาษาญี่ปุ่นประจำวัน",
    "japanese_title": "Talking About Japanese Breakfast (日本の朝ごはん) | Japanese Daily Podcast",
    "channel": "Japanese Daily Podcast",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 50,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 983,
    "thumbnail_gradient": "from-amber-800 via-yellow-950 to-slate-900",
    "scene_emoji": "🍚",
    "description": "พอดแคสต์สนทนาภาษาญี่ปุ่นเกี่ยวกับวัฒนธรรมและเมนูอาหารเช้าในชีวิตจริงของคนญี่ปุ่น"
  },
  {
    "id": "vid-pod-kensan-02",
    "youtube_id": "KDVGWFQDtjE",
    "title": "เดินป่าขึ้นเขาในญี่ปุ่น: ฝึกฟังภาษาญี่ปุ่นจากสถานการณ์จริง 20 นาที",
    "japanese_title": "A Mountain Walk in Japan ⛰️ | Real Japanese Immersion for 20 min",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 1215,
    "thumbnail_gradient": "from-emerald-800 via-green-950 to-slate-900",
    "scene_emoji": "⛰️",
    "description": "ฝึกฟังภาษาญี่ปุ่นที่เป็นธรรมชาติระหว่างการเดินขึ้นเขาเป็นเวลา 20 นาที เหมาะสำหรับฝึกฟังและพูดตาม"
  },
  {
    "id": "vid-pod-kensan-03",
    "youtube_id": "N-IPb9J7lA0",
    "title": "ทายคำศัพท์ภาษาญี่ปุ่นในชีวิตประจำวัน: ชาเลนจ์ฝึกฟังภาษาญี่ปุ่น",
    "japanese_title": "Can You Guess These Everyday Japanese Words? 🇯🇵 | Japanese Listening Challenge",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 1219,
    "thumbnail_gradient": "from-violet-900 via-indigo-950 to-slate-900",
    "scene_emoji": "🧩",
    "description": "ฝึกฟังภาษาญี่ปุ่นพร้อมทายคำศัพท์ที่ใช้ในชีวิตประจำวันขณะเดินเล่นกลางแจ้ง"
  },
  {
    "id": "vid-news-abe-02",
    "youtube_id": "iWg70cSpX9I",
    "title": "ข่าวภาษาญี่ปุ่นเข้าใจง่าย: หุ่นยนต์อวตารต้อนรับลูกค้าและธนบัตร 1 หมื่นเยนแบบใหม่",
    "japanese_title": "やさしい日本語ニュースわん 9/6　「分身ロボットで接客、生きる希望に」「政府、客に渡す12の品物にプラスチックを使わないで」「新しい1万円のお札　工場で印刷が始まる」",
    "channel": "阿部先生の日本語教室",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 50,
      "N3": 15,
      "N2": 0,
      "N1": 0
    },
    "duration": 703,
    "thumbnail_gradient": "from-blue-900 via-slate-900 to-zinc-950",
    "scene_emoji": "🤖",
    "description": "เล่าข่าวภาษาญี่ปุ่นเข้าใจง่ายเรื่องการใช้หุ่นยนต์บริการลูกค้า การลดพลาสติก และการเริ่มพิมพ์ธนบัตร 1 หมื่นเยนรุ่นใหม่"
  },
  {
    "id": "vid-vlog-mogura-01",
    "youtube_id": "JEqLEm8XQe8",
    "title": "วล็อกทริปสั้นในโตเกียว: พิพิธภัณฑ์ศิลปะ ตระเวนคาเฟ่ และชมวิวกลางคืน",
    "japanese_title": "【VLOG】美術館🎨/カフェ巡り☕️/夜景🌉/    Tokyo short trip /museum/shopping/traveling alone💭",
    "channel": "Mogura.",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 50,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 605,
    "thumbnail_gradient": "from-purple-900 via-slate-900 to-zinc-950",
    "scene_emoji": "🎨",
    "description": "วล็อกเที่ยวโตเกียวคนเดียวแบบไม่ได้วางแผนล่วงหน้า ไปชมพิพิธภัณฑ์ศิลปะ คาเฟ่ และวิวกลางคืน"
  },
  {
    "id": "vid-anime-milky-01",
    "youtube_id": "iHd7eWUXuLU",
    "title": "อนิเมะ รถด่วนกาแล็กซี มิลกี้☆ซับเวย์ ตอนที่ 1: ออกเดินทาง",
    "japanese_title": "第1話「出発進行」│アニメ『銀河特急 ミルキー☆サブウェイ』本編│Episode01 \"All Aboard!\"   MILKY☆SUBWAY THE GALACTIC LIMITED EXPRESS",
    "channel": "MILKY☆SUBWAY THE GALACTIC LIMITED EXPRESS",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 45,
      "N3": 20,
      "N2": 0,
      "N1": 0
    },
    "duration": 210,
    "thumbnail_gradient": "from-pink-800 via-rose-950 to-slate-900",
    "scene_emoji": "🚆",
    "description": "อนิเมะเรื่อง Milky Subway The Galactic Limited Express ตอนที่ 1 (ออกเดินทาง) ฉบับทางการพร้อมซับภาษาญี่ปุ่น"
  },
  {
    "id": "vid-yt-hajime-01",
    "youtube_id": "xgvS5DWj2MI",
    "title": "ฮาจิเมะชาโจ: กินจุบุฟเฟต์พิซซ่าที่ Domino's Pizza แบบเอาจริง",
    "japanese_title": "【最高】ドミノピザに食べ放題があるらしいので本気で大食いしてみた。",
    "channel": "はじめしゃちょー（hajime）",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 20,
      "N4": 30,
      "N3": 40,
      "N2": 10,
      "N1": 0
    },
    "duration": 1245,
    "thumbnail_gradient": "from-red-900 via-orange-950 to-slate-900",
    "scene_emoji": "🍕",
    "description": "ฮาจิเมะชาโจไปท้าพิสูจน์กินบุฟเฟต์พิซซ่าแบบกินจุที่ร้าน Domino's Pizza ตามชื่อคลิป"
  },
  {
    "id": "vid-yt-hajime-02",
    "youtube_id": "HvEsqZpzzwY",
    "title": "ฮาจิเมะชาโจ: ลองขึ้นรถบัสซูชิสายพานบุฟเฟต์บนชั้น 2 ของรถบัส",
    "japanese_title": "【世界初】バスの2階が回転寿司食べ放題。寿司バスに乗ってみた。",
    "channel": "はじめしゃちょー（hajime）",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 20,
      "N4": 30,
      "N3": 40,
      "N2": 10,
      "N1": 0
    },
    "duration": 1217,
    "thumbnail_gradient": "from-amber-900 via-red-950 to-slate-900",
    "scene_emoji": "🍣",
    "description": "ฮาจิเมะชาโจพาไปลองนั่งรถบัสที่มีบุฟเฟต์ซูชิสายพานอยู่บนชั้นสองของรถตามชื่อคลิป"
  },
  {
    "id": "vid-yt-hikakin-01",
    "youtube_id": "YMovXcZd7_s",
    "title": "ฮิคาคินเล่าประสบการณ์เข้าโรงพยาบาลจากอาการปอดอักเสบ",
    "japanese_title": "肺炎で入院してました",
    "channel": "HikakinTV",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 30,
      "N3": 45,
      "N2": 10,
      "N1": 0
    },
    "duration": 1015,
    "thumbnail_gradient": "from-sky-900 via-slate-900 to-zinc-950",
    "scene_emoji": "🏥",
    "description": "ฮิคาคินเล่าเหตุการณ์และอาการป่วยเมื่อต้องเข้ารับการรักษาในโรงพยาบาลด้วยโรคปอดอักเสบ"
  },
  {
    "id": "vid-yt-tokai-01",
    "youtube_id": "SAMHT6yF6pg",
    "title": "โทไคออนแอร์: ทดลองหาช่วงอายุของคุณยายที่รู้จักคำว่าบาซูก้า",
    "japanese_title": "おばあちゃんにバズーカを見せて「バズーカ」と答えられる年齢の境目を見つけよう！！！",
    "channel": "東海オンエア",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 0
    },
    "duration": 1071,
    "thumbnail_gradient": "from-orange-900 via-amber-950 to-slate-900",
    "scene_emoji": "🚀",
    "description": "รายการวาไรตี้จากช่องโทไคออนแอร์ ทดลองนำบาซูก้าไปให้ผู้สูงอายุดูเพื่อหาช่วงอายุที่ตอบชื่อได้ถูกต้อง"
  },
  {
    "id": "vid-yt-mizutamari-01",
    "youtube_id": "PfHE5TX2zQ0",
    "title": "มิซึทามาริบอนด์: กินข้าวหน้าทะเลทาวเวอร์ชามยักษ์ราคา 4,500 เยน",
    "japanese_title": "【大盛り】海鮮タワー丼(¥4,500)が美味しすぎて話が盛り上がりすぎて大反省しました【すしめん処大京】",
    "channel": "水溜りボンド",
    "category": "Street Food",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 30,
      "N3": 45,
      "N2": 10,
      "N1": 0
    },
    "duration": 1226,
    "thumbnail_gradient": "from-cyan-900 via-blue-950 to-slate-900",
    "scene_emoji": "🦐",
    "description": "คู่หูมิซึทามาริบอนด์ไปรับประทานข้าวหน้าปลาดิบทาวเวอร์ชามใหญ่และพูดคุยกันอย่างออกรสจนลืมรีวิวอาหาร"
  },
  {
    "id": "vid-yt-kimagure-01",
    "youtube_id": "NeF1EvROj_k",
    "title": "คิมากุเระคุ้ก: แล่ปลาไทฤดูใบไม้ร่วงที่มีมันแทรกมาทำเมนูเด็ด",
    "japanese_title": "脂の乗った紅葉ダイを使ってアレを作ります！",
    "channel": "Kimagure Cook",
    "category": "Street Food",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 0
    },
    "duration": 1083,
    "thumbnail_gradient": "from-rose-900 via-red-950 to-slate-900",
    "scene_emoji": "🐟",
    "description": "คิมากุเระคุ้กสาธิตการแล่ปลาไทฤดูใบไม้ร่วงที่มีไขมันแทรกพร้อมทำเมนูพิเศษร่วมกับ Lawson"
  },
  {
    "id": "vid-game-asdf-01",
    "youtube_id": "W2kzD8R4Wr4",
    "title": "แคสเกม Poppy Playtime Chapter 1 เวอร์ชันเพิ่มเสียงพากย์ญี่ปุ่น",
    "japanese_title": "【ゆっくり実況】日本語音声が追加されたチャプター1を改めてプレイしました - Poppy Playtime【ホラーゲーム】",
    "channel": "asdfgame",
    "category": "Gaming",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 0
    },
    "duration": 1027,
    "thumbnail_gradient": "from-purple-950 via-indigo-950 to-slate-950",
    "scene_emoji": "🎮",
    "description": "เล่นและบรรยายเกมสยองขวัญ Poppy Playtime บทที่ 1 ใหม่อีกครั้งหลังจากอัปเดตเพิ่มเสียงพากย์ภาษาญี่ปุ่น"
  },
  {
    "id": "vid-vlog-mei-02",
    "youtube_id": "hCXm09-UCbU",
    "title": "ฤดูใบไม้ร่วงที่เกียวโต: วันสบาย ๆ ในเมืองมัทฉะที่อุจิ",
    "japanese_title": "Autumn in KYOTO 🍁 A peaceful day in Uji’s matcha town | Japan Travel Vlog",
    "channel": "Mei Time",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 0
    },
    "duration": 1152,
    "thumbnail_gradient": "from-emerald-900 via-stone-900 to-slate-950",
    "scene_emoji": "🍵",
    "description": "วล็อกท่องเที่ยวชมใบไม้เปลี่ยนสีและบรรยากาศเงียบสงบในเมืองอุจิ จังหวัดเกียวโต"
  },
  {
    "id": "vid-food-hurley-01",
    "youtube_id": "uhLxJn1ooEY",
    "title": "แนะนำ 8 ร้านราเม็งสถานีโตเกียว: ร้านรางวัลมิชลิน 3 ปีซ้อนและร้านดัง",
    "japanese_title": "【東京駅ラーメン8選】ミシュラン3年連続獲得ラーメン、東京駅No.1ラーメンなど！",
    "channel": "ハーリーのグルメ",
    "category": "Street Food",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 25,
      "N3": 45,
      "N2": 15,
      "N1": 0
    },
    "duration": 1030,
    "thumbnail_gradient": "from-amber-900 via-orange-950 to-slate-900",
    "scene_emoji": "🍜",
    "description": "รีวิว 8 ร้านราเม็งแนะนำรอบสถานีโตเกียว ทั้งร้านที่ได้รางวัลมิชลิน 3 ปีซ้อนและร้านฮากาตะราเม็งเก่าแก่"
  },
  {
    "id": "vid-vlog-hige-01",
    "youtube_id": "S6jokAK6aFM",
    "title": "วล็อกเที่ยวเกียวโตฤดูใบไม้ผลิ 3 คืน 4 วัน: กิน ดื่มชา ช้อปปิ้ง และพักโรงแรมมาจิยะ",
    "japanese_title": "【旅行vlog】春の京都3泊4日 | 食と茶と買い物を楽しむゆるり旅 | 京町屋ホテル",
    "channel": "HIGE and ME",
    "category": "Vlogs",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 15,
      "N4": 30,
      "N3": 40,
      "N2": 15,
      "N1": 0
    },
    "duration": 1441,
    "thumbnail_gradient": "from-indigo-900 via-violet-950 to-slate-900",
    "scene_emoji": "🍵",
    "description": "วล็อกทริปเที่ยวเกียวโตช่วงฤดูใบไม้ผลิ 3 คืน 4 วัน เพลิดเพลินกับอาหาร ชา การช้อปปิ้ง และการพักในโรงแรมบ้านไม้เคียวมาจิยะ"
  },
  {
    "id": "vid-yt-tokai-02",
    "youtube_id": "mBAR_BCPtf0",
    "title": "โทไคออนแอร์: จะเกิดอะไรขึ้นถ้าแหกกฎเหล็ก 10 ข้อของนิยายสืบสวนทั้งหมด",
    "japanese_title": "ミステリーの禁忌、\"ノックスの十戒\"を全て破ったら大変な事に！！",
    "channel": "東海オンエア",
    "category": "Vlogs",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 20,
      "N3": 30,
      "N2": 35,
      "N1": 5
    },
    "duration": 1259,
    "thumbnail_gradient": "from-slate-800 via-zinc-950 to-black",
    "scene_emoji": "🕵️",
    "description": "โทไคออนแอร์ทดลองสร้างเรื่องราวสืบสวนโดยจงใจละเมิดกฎ 10 ข้อของน็อกซ์ (Knox's Decalogue) ทั้งหมด"
  },
  {
    "id": "vid-yt-mizutamari-02",
    "youtube_id": "TBfu_Q6_I6s",
    "title": "มิซึทามาริบอนด์: ประกาศสำคัญ คันตะแต่งงานแล้ว!",
    "japanese_title": "【ご報告】カンタ、結婚しました！！",
    "channel": "水溜りボンド",
    "category": "Vlogs",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 20,
      "N3": 30,
      "N2": 35,
      "N1": 5
    },
    "duration": 916,
    "thumbnail_gradient": "from-rose-900 via-pink-950 to-slate-900",
    "scene_emoji": "💍",
    "description": "คันตะแห่งช่องมิซึทามาริบอนด์ออกมาประกาศข่าวการแต่งงานและพูดคุยความรู้สึกขอบคุณผู้ติดตาม"
  },
  {
    "id": "vid-pod-haru-01",
    "youtube_id": "FmdW0ueCc2w",
    "title": "พอดแคสต์ระดับกลาง-สูง: การใช้รูปสุภาพ (Keigo) กับภาษาเป็นกันเอง (Tameguchi)",
    "japanese_title": "敬語を使うと距離ができる？敬語とタメ口の話｜日本語ポッドキャスト、N3～N1聴解【中級、上級】",
    "channel": "Haru no Nihongo",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 15,
      "N3": 30,
      "N2": 35,
      "N1": 10
    },
    "duration": 1302,
    "thumbnail_gradient": "from-purple-900 via-indigo-950 to-slate-900",
    "scene_emoji": "🗣️",
    "description": "พอดแคสต์ฝึกฟังระดับ N3-N1 พูดคุยเรื่องระยะห่างทางสังคมเมื่อใช้ภาษาสุภาพ (Keigo) และภาษาพูดกันเอง"
  },
  {
    "id": "vid-news-enjoyjp-01",
    "youtube_id": "xIA3otvDvjI",
    "title": "เรียนภาษาญี่ปุ่นจากข่าว #3: ข่าวเทศกาลกิองและเศรษฐกิจ",
    "japanese_title": "ニュースから学ぶ！Learn from Japanese news! #3　（日本語字幕付き）",
    "channel": "Enjoy Japanese",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 15,
      "N3": 25,
      "N2": 40,
      "N1": 10
    },
    "duration": 1104,
    "thumbnail_gradient": "from-blue-950 via-slate-900 to-zinc-950",
    "scene_emoji": "📰",
    "description": "เรียนรู้คำศัพท์และเนื้อหาจากบทความข่าวหนังสือพิมพ์เกียวโตและนิกเคอิ พร้อมคำอธิบายภาษาญี่ปุ่น"
  },
  {
    "id": "vid-doc-koto-01",
    "youtube_id": "0w2HmGVq2DA",
    "title": "สารคดีกว่าจะเป็นพิณโคโตะ: ช่างฝีมือวัย 79 ปีผู้สร้างเครื่องดนตรีดั้งเดิมของญี่ปุ่น",
    "japanese_title": "琴ができるまで。神様に選ばれた79歳の琴職人が作る日本の伝統楽器。",
    "channel": "Japanese Industry Process",
    "category": "Vlogs",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 15,
      "N3": 25,
      "N2": 40,
      "N1": 10
    },
    "duration": 1068,
    "thumbnail_gradient": "from-stone-800 via-amber-950 to-slate-950",
    "scene_emoji": "🎶",
    "description": "สารคดีตามติดขั้นตอนการสร้างพิณโคโตะและสัมภาษณ์ช่างฝีมือวัย 79 ปีในจังหวัดฮิโรชิมะ"
  },
  {
    "id": "vid-doc-yuka-01",
    "youtube_id": "fqJUWLZ7FBg",
    "title": "5 ศิลปะการแสดงดั้งเดิมของญี่ปุ่น: ประวัติศาสตร์ เอกลักษณ์ และวิธีรับชม",
    "japanese_title": "知っていますか？ 日本の伝統芸能5選！歴史・特徴・鑑賞の楽しみ方　  #yuka老師的日本語教室",
    "channel": "Yuka's Japanese Class",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 10,
      "N4": 15,
      "N3": 25,
      "N2": 40,
      "N1": 10
    },
    "duration": 1435,
    "thumbnail_gradient": "from-red-950 via-stone-900 to-slate-950",
    "scene_emoji": "🎭",
    "description": "อธิบายประวัติและจุดเด่นของศิลปะการแสดงดั้งเดิมของญี่ปุ่น 5 แขนง ได้แก่ กากากุ โนกากุ คาบูกิ บุนรากุ และคุมิโอโดริ"
  },
  {
    "id": "vid-news-ainewslab-01",
    "youtube_id": "HyK2DV5Y2kA",
    "title": "วิเคราะห์เศรษฐกิจมหภาค: มาตรฐานการครองชีพที่ลดลงกับดัชนีเศรษฐกิจและค่าเงินเยน",
    "japanese_title": "【経済】【字幕対応】国民の生活水準低下 vs 経済指標好転！？ - サナエノミクスの「エコチェンバー」と マクロ経済の共通認識 Part 2【AI解説】",
    "channel": "+AI News Lab",
    "category": "Podcasts",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 5,
      "N4": 10,
      "N3": 20,
      "N2": 30,
      "N1": 35
    },
    "duration": 416,
    "thumbnail_gradient": "from-slate-900 via-blue-950 to-zinc-950",
    "scene_emoji": "📉",
    "description": "วิเคราะห์ข่าวและนโยบายเศรษฐกิจมหภาคของญี่ปุ่น ปัญหาเงินเฟ้อ ค่าเงินเยนอ่อนค่า และผลกระทบต่อทรัพย์สินของประชาชน"
  },
  {
    "id": "vid-news-stock-01",
    "youtube_id": "XloXpxDlx68",
    "title": "วิเคราะห์ตลาดหุ้นญี่ปุ่น: ดัชนีนิกเคอิร่วง 6.0% และเงื่อนไขการเฝ้าดูหุ้น",
    "japanese_title": "日経平均6.0%安｜下落482銘柄、売りの広がり｜アステラス製薬の監視条件【11/6 日本株】",
    "channel": "耳でわかる株式市場",
    "category": "Podcasts",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 5,
      "N4": 10,
      "N3": 15,
      "N2": 30,
      "N1": 40
    },
    "duration": 437,
    "thumbnail_gradient": "from-emerald-950 via-slate-900 to-zinc-950",
    "scene_emoji": "📊",
    "description": "สรุปและวิเคราะห์ความเคลื่อนไหวของตลาดหุ้นญี่ปุ่น ดัชนีนิกเคอิ ข่าวกลุ่มเซมิคอนดักเตอร์ และเงื่อนไขการลงทุนรายวัน"
  },
  {
    "id": "vid-doc-noh-01",
    "youtube_id": "RNE60ygYH6E",
    "title": "ความรู้พื้นฐานเพื่อการชมละครโน (Noh): ศิลปะการแสดงดั้งเดิมของญี่ปุ่น",
    "japanese_title": "能を楽しむための基礎知識❖日本の伝統芸能【日本通tv】",
    "channel": "NipponTsuTV",
    "category": "Vlogs",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 5,
      "N4": 10,
      "N3": 20,
      "N2": 30,
      "N1": 35
    },
    "duration": 722,
    "thumbnail_gradient": "from-amber-950 via-stone-950 to-black",
    "scene_emoji": "👹",
    "description": "สารคดีแนะนำประวัติศาสตร์ 650 ปีของละครโน เวทีการแสดง บทบาทตัวละคร เครื่องดนตรี และการสวมใส่ชุดโชโซกุ"
  },
  {
    "id": "vid-doc-tedxsaku-01",
    "youtube_id": "EzXvih454dM",
    "title": "บรรยาย TEDxSaku: เวลาคือทรัพย์สินอันล้ำค่า โดย ฮิเดทากะ นากาโอกะ",
    "japanese_title": "時間という財産: Hidetaka Nagaoka at TEDxSaku",
    "channel": "TEDx Talks",
    "category": "Podcasts",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 5,
      "N4": 10,
      "N3": 20,
      "N2": 30,
      "N1": 35
    },
    "duration": 1183,
    "thumbnail_gradient": "from-red-950 via-slate-900 to-zinc-950",
    "scene_emoji": "⏳",
    "description": "การบรรยายบนเวที TEDxSaku ว่าด้วยคุณค่าของเวลา มุมมองต่อชีวิต และการก่อตั้งโรงเรียนทางเลือกเพื่อช่วยเหลือเยาวชน"
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
