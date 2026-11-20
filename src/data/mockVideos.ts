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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 33,
      "N4": 17,
      "N3": 19,
      "N2": 4,
      "N1": 27
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
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 18,
      "N3": 17,
      "N2": 4,
      "N1": 24
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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 34,
      "N4": 16,
      "N3": 19,
      "N2": 4,
      "N1": 27
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 33,
      "N4": 11,
      "N3": 16,
      "N2": 4,
      "N1": 36
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 34,
      "N4": 12,
      "N3": 22,
      "N2": 5,
      "N1": 27
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
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 34,
      "N4": 12,
      "N3": 16,
      "N2": 5,
      "N1": 33
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 13,
      "N3": 20,
      "N2": 5,
      "N1": 27
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
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 14,
      "N3": 19,
      "N2": 3,
      "N1": 25
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
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 14,
      "N3": 17,
      "N2": 3,
      "N1": 30
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
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 16,
      "N3": 19,
      "N2": 3,
      "N1": 25
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
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 28,
      "N4": 12,
      "N3": 21,
      "N2": 5,
      "N1": 34
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 14,
      "N3": 20,
      "N2": 3,
      "N1": 27
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 32,
      "N4": 12,
      "N3": 20,
      "N2": 3,
      "N1": 33
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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 33,
      "N4": 13,
      "N3": 22,
      "N2": 2,
      "N1": 30
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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 15,
      "N3": 17,
      "N2": 3,
      "N1": 30
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
      "N5": 39,
      "N4": 13,
      "N3": 20,
      "N2": 5,
      "N1": 23
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
      "N5": 30,
      "N4": 18,
      "N3": 21,
      "N2": 5,
      "N1": 26
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
      "N5": 36,
      "N4": 13,
      "N3": 17,
      "N2": 5,
      "N1": 29
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
      "N5": 44,
      "N4": 13,
      "N3": 15,
      "N2": 3,
      "N1": 25
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
      "N5": 49,
      "N4": 21,
      "N3": 11,
      "N2": 4,
      "N1": 15
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
      "N5": 43,
      "N4": 25,
      "N3": 12,
      "N2": 2,
      "N1": 18
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
      "N5": 40,
      "N4": 26,
      "N3": 12,
      "N2": 3,
      "N1": 19
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
      "N5": 48,
      "N4": 23,
      "N3": 10,
      "N2": 3,
      "N1": 16
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
      "N5": 62,
      "N4": 10,
      "N3": 13,
      "N2": 2,
      "N1": 13
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 15,
      "N3": 16,
      "N2": 3,
      "N1": 26
    },
    "duration": 1074,
    "thumbnail_gradient": "from-amber-900 via-orange-950 to-slate-900",
    "scene_emoji": "☀️",
    "description": "วล็อกวันหยุดของคนวัยทำงานอายุ 24 ปีที่เริ่มต้นตั้งแต่ 5:30 น. ด้วยการอ่านหนังสือ ไปคาเฟ่ และจัดแต่งห้องพัก"
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
      "N5": 61,
      "N4": 13,
      "N3": 10,
      "N2": 1,
      "N1": 15
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
      "N5": 69,
      "N4": 9,
      "N3": 9,
      "N2": 1,
      "N1": 12
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
      "N5": 58,
      "N4": 18,
      "N3": 9,
      "N2": 0,
      "N1": 15
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 48,
      "N4": 13,
      "N3": 15,
      "N2": 2,
      "N1": 22
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 47,
      "N4": 11,
      "N3": 18,
      "N2": 5,
      "N1": 19
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 47,
      "N4": 13,
      "N3": 15,
      "N2": 4,
      "N1": 21
    },
    "duration": 941,
    "thumbnail_gradient": "from-orange-900 via-amber-950 to-slate-900",
    "scene_emoji": "🍳",
    "description": "ฝึกฟังคำศัพท์และประโยคภาษาญี่ปุ่นในชีวิตประจำวันผ่านการลงมือทำอาหาร"
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
      "N5": 50,
      "N4": 18,
      "N3": 15,
      "N2": 2,
      "N1": 15
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
      "N5": 44,
      "N4": 22,
      "N3": 18,
      "N2": 3,
      "N1": 13
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
      "N5": 51,
      "N4": 12,
      "N3": 16,
      "N2": 3,
      "N1": 18
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
      "N5": 40,
      "N4": 14,
      "N3": 21,
      "N2": 3,
      "N1": 22
    },
    "duration": 1384,
    "thumbnail_gradient": "from-rose-900 via-purple-950 to-slate-900",
    "scene_emoji": "👘",
    "description": "ฝึกฟังภาษาญี่ปุ่นผ่านการสวมชุดกิโมโนเดินชมย่านกินซ่าและสัมผัสวัฒนธรรมอาหารญี่ปุ่น"
  },
  {
    "id": "vid-pod-kensan-02",
    "youtube_id": "KDVGWFQDtjE",
    "title": "เดินป่าขึ้นเขาในญี่ปุ่น: ฝึกฟังภาษาญี่ปุ่นจากสถานการณ์จริง 20 นาที",
    "japanese_title": "A Mountain Walk in Japan ⛰️ | Real Japanese Immersion for 20 min",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 57,
      "N4": 16,
      "N3": 13,
      "N2": 3,
      "N1": 11
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
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 18,
      "N3": 10,
      "N2": 1,
      "N1": 11
    },
    "duration": 1219,
    "thumbnail_gradient": "from-violet-900 via-indigo-950 to-slate-900",
    "scene_emoji": "🧩",
    "description": "ฝึกฟังภาษาญี่ปุ่นพร้อมทายคำศัพท์ที่ใช้ในชีวิตประจำวันขณะเดินเล่นกลางแจ้ง"
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
      "N5": 42,
      "N4": 13,
      "N3": 16,
      "N2": 3,
      "N1": 26
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
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 33,
      "N4": 12,
      "N3": 17,
      "N2": 6,
      "N1": 32
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
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 16,
      "N3": 16,
      "N2": 4,
      "N1": 27
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 15,
      "N3": 16,
      "N2": 4,
      "N1": 25
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 17,
      "N3": 19,
      "N2": 5,
      "N1": 22
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 14,
      "N3": 18,
      "N2": 3,
      "N1": 23
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 17,
      "N3": 13,
      "N2": 6,
      "N1": 23
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
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 12,
      "N3": 22,
      "N2": 3,
      "N1": 24
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
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 14,
      "N3": 17,
      "N2": 6,
      "N1": 33
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
      "N5": 35,
      "N4": 14,
      "N3": 17,
      "N2": 6,
      "N1": 28
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
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 10,
      "N3": 21,
      "N2": 3,
      "N1": 31
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 12,
      "N3": 21,
      "N2": 4,
      "N1": 22
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 15,
      "N3": 20,
      "N2": 3,
      "N1": 24
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
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 17,
      "N3": 16,
      "N2": 4,
      "N1": 21
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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 16,
      "N3": 13,
      "N2": 7,
      "N1": 21
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
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 16,
      "N3": 20,
      "N2": 2,
      "N1": 25
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
      "N5": 19,
      "N4": 12,
      "N3": 20,
      "N2": 10,
      "N1": 39
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
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 33,
      "N4": 15,
      "N3": 22,
      "N2": 4,
      "N1": 26
    },
    "duration": 1435,
    "thumbnail_gradient": "from-red-950 via-stone-900 to-slate-950",
    "scene_emoji": "🎭",
    "description": "อธิบายประวัติและจุดเด่นของศิลปะการแสดงดั้งเดิมของญี่ปุ่น 5 แขนง ได้แก่ กากากุ โนกากุ คาบูกิ บุนรากุ และคุมิโอโดริ"
  },
  {
    "id": "vid-doc-tedxsaku-01",
    "youtube_id": "EzXvih454dM",
    "title": "บรรยาย TEDxSaku: เวลาคือทรัพย์สินอันล้ำค่า โดย ฮิเดทากะ นากาโอกะ",
    "japanese_title": "時間という財産: Hidetaka Nagaoka at TEDxSaku",
    "channel": "TEDx Talks",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 15,
      "N3": 19,
      "N2": 2,
      "N1": 20
    },
    "duration": 1183,
    "thumbnail_gradient": "from-red-950 via-slate-900 to-zinc-950",
    "scene_emoji": "⏳",
    "description": "การบรรยายบนเวที TEDxSaku ว่าด้วยคุณค่าของเวลา มุมมองต่อชีวิต และการก่อตั้งโรงเรียนทางเลือกเพื่อช่วยเหลือเยาวชน"
  },
  {
    "id": "vid-yt-hajime-03",
    "youtube_id": "fAXc2iSQT3Y",
    "title": "10 สิ่งของที่ขาดไม่ได้ในชีวิตของยูทูบเบอร์ ฮาจิเมะชาโจ",
    "japanese_title": "YouTuberはじめしゃちょーの人生に欠かせない10のアイテム",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 13,
      "N3": 15,
      "N2": 5,
      "N1": 28
    },
    "duration": 805,
    "thumbnail_gradient": "from-red-900 via-orange-950 to-slate-900",
    "scene_emoji": "🎒",
    "description": "ฮาจิเมะชาโจแนะนำสิ่งของ 10 อย่างที่มีความสำคัญและจำเป็นอย่างยิ่งต่อการใช้ชีวิตและการทำงาน"
  },
  {
    "id": "vid-yt-hajime-04",
    "youtube_id": "8NELQojJw_U",
    "title": "ให้ ChatGPT คิดไอเดียคลิปที่จะต้องแมสแน่นอนให้ผม",
    "japanese_title": "「チャットGPT」にオレが絶対バズる動画のネタ考えさせてみた。",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 13,
      "N3": 16,
      "N2": 5,
      "N1": 30
    },
    "duration": 928,
    "thumbnail_gradient": "from-teal-900 via-emerald-950 to-slate-900",
    "scene_emoji": "🤖",
    "description": "ฮาจิเมะชาโจทดลองให้ปัญญาประดิษฐ์ ChatGPT ช่วยคิดหัวข้อคลิปวิดีโอที่น่าจะได้รับความนิยมอย่างถล่มทลาย"
  },
  {
    "id": "vid-yt-hajime-05",
    "youtube_id": "F1k5UgeNHmk",
    "title": "พิสูจน์: ดื่มเครื่องดื่มเพิ่มความสูง Senobic ต่อเนื่องทุกวัน 30 วัน ส่วนสูงจะเพิ่มขึ้นไหม",
    "japanese_title": "【検証】30日間毎日セノビックを飲み続けたら身長は伸びるの？",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 13,
      "N3": 20,
      "N2": 4,
      "N1": 21
    },
    "duration": 1005,
    "thumbnail_gradient": "from-blue-900 via-cyan-950 to-slate-900",
    "scene_emoji": "🥛",
    "description": "การทดลองดื่มผลิตภัณฑ์เสริมสารอาหารเซโนบิคติดต่อกัน 30 วันเพื่อวัดว่าส่วนสูงจะเพิ่มขึ้นจริงหรือไม่"
  },
  {
    "id": "vid-yt-hajime-06",
    "youtube_id": "9-hPqlXaycI",
    "title": "กินขนมปัง FamilyMart ทุกชนิดแล้วจัดอันดับ แถมยังเอามาผสมรวมกันด้วย",
    "japanese_title": "ファミマのパンを全部食べてランキングを付ける！あ。ついでに全部混ぜます",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 16,
      "N3": 14,
      "N2": 3,
      "N1": 30
    },
    "duration": 1085,
    "thumbnail_gradient": "from-green-900 via-emerald-950 to-slate-900",
    "scene_emoji": "🍞",
    "description": "ฮาจิเมะชาโจชิมขนมปังทุกแบบที่มีขายในแฟมิลี่มาร์ทเพื่อจัดอันดับความอร่อยก่อนนำมารวมกัน"
  },
  {
    "id": "vid-yt-hajime-07",
    "youtube_id": "gBhY1uCqwso",
    "title": "ลองลงประมูลเก้าอี้เกมมิ่งราคา 3.5 ล้านเยนในราคาเริ่มต้น 1 เยน",
    "japanese_title": "350万円のゲーミングチェアを1円で出品してみたwwwww",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 13,
      "N3": 16,
      "N2": 5,
      "N1": 25
    },
    "duration": 606,
    "thumbnail_gradient": "from-purple-900 via-indigo-950 to-slate-900",
    "scene_emoji": "💺",
    "description": "การนำเก้าอี้เกมมิ่งราคาแพงสามล้านห้าแสนเยนมาเปิดประมูลออนไลน์โดยตั้งราคาเริ่มต้นเพียงหนึ่งเยน"
  },
  {
    "id": "vid-yt-hajime-08",
    "youtube_id": "YCTa2iAo2Bo",
    "title": "เหมาตู้รถไฟชินคันเซ็นคนเดียวทั้งตู้",
    "japanese_title": "1人で新幹線貸し切ってみたwwwww",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 15,
      "N3": 14,
      "N2": 7,
      "N1": 23
    },
    "duration": 1147,
    "thumbnail_gradient": "from-sky-900 via-blue-950 to-slate-900",
    "scene_emoji": "🚄",
    "description": "ฮาจิเมะชาโจจองและเหมาโบกี้รถไฟหัวกระสุนชินคันเซ็นทั้งตู้เพื่อเดินทางคนเดียวแบบส่วนตัว"
  },
  {
    "id": "vid-yt-hajime-09",
    "youtube_id": "Dy0vsCaEOO8",
    "title": "ซื้อมอเตอร์ไซค์ดีไซน์ล้ำสุดเท่ NM4-02 แต่กลับเจอเรื่องไม่คาดคิด",
    "japanese_title": "【衝撃】カッコ良すぎるバイクを買ったけどこの男まさかのwwwww【NM4-02】",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 11,
      "N3": 13,
      "N2": 5,
      "N1": 29
    },
    "duration": 919,
    "thumbnail_gradient": "from-zinc-800 via-stone-900 to-black",
    "scene_emoji": "🏍️",
    "description": "การรีวิวมอเตอร์ไซค์บิ๊กไบค์ทรงล้ำยุครุ่น NM4-02 ที่เพิ่งซื้อมาพร้อมความรู้สึกในการขับขี่"
  },
  {
    "id": "vid-yt-hajime-10",
    "youtube_id": "Wgx9Cn9kGLk",
    "title": "ปี 2025 สั่งห้ามตัวเองทำสิ่งนี้ตลอด 1 ปีเต็ม ไม่รู้จะใช้ชีวิตรอดไหม",
    "japanese_title": "2025年。1年間○○禁止します。生活できるか分かりません。",
    "channel": "はじめしゃちょー（hajime）",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 15,
      "N3": 15,
      "N2": 3,
      "N1": 25
    },
    "duration": 1154,
    "thumbnail_gradient": "from-red-950 via-neutral-900 to-black",
    "scene_emoji": "🚫",
    "description": "การประกาศกติกาห้ามทำพฤติกรรมบางอย่างตลอดทั้งปี 2025 เพื่อท้าทายตัวเองในการใช้ชีวิต"
  },
  {
    "id": "vid-n5-vlog-expo-01",
    "youtube_id": "DHNTbj4Ro9I",
    "title": "พาเที่ยวงานโอซาก้าเอ็กซ์โป 2025 ด้วยภาษาญี่ปุ่นเข้าใจง่าย",
    "japanese_title": "【Easy Japanese】Osaka Expo 2025 Vlog /【やさしい日本語】大阪・関西万博2025",
    "channel": "Learn Japanese with Shufu",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 947,
    "thumbnail_gradient": "from-blue-950 via-sky-950 to-slate-900",
    "scene_emoji": "🎡",
    "description": "วิดีโอบันทึกการเดินทางเที่ยวชมงานโอซาก้าเอ็กซ์โป 2025 ด้วยภาษาญี่ปุ่นระดับง่าย (やさしい日本語 N5 Beginner)",
    "jlpt_distribution": {
      "N5": 47,
      "N4": 15,
      "N3": 15,
      "N2": 2,
      "N1": 21
    }
  },
  {
    "id": "vid-n5-vlog-park-02",
    "youtube_id": "2uDbZhzZrbM",
    "title": "เดินเล่นรับลมที่สวนสาธารณะท่าเรือเซนได ฝึกฟังภาษาญี่ปุ่นง่ายๆ",
    "japanese_title": "【A Park at Sendai Port】にほんご listening practice | Easy Japanese with subtitles | Japanese vlog",
    "channel": "KOTONOHA Journey　ことのはの旅",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 655,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🌳",
    "description": "พาทุกคนไปเดินเล่นพักผ่อนที่สวนสาธารณะริมท่าเรือเซนไดพร้อมคำบรรยายภาษาญี่ปุ่นช้าๆ (Easy Japanese N5)",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 11,
      "N3": 20,
      "N2": 3,
      "N1": 23
    }
  },
  {
    "id": "vid-n5-vlog-daily-03",
    "youtube_id": "7Vm_fEjWST0",
    "title": "หนึ่งวันสบายๆ พูดภาษาญี่ปุ่นเป็นธรรมชาติแบบช้าๆ สำหรับฝึกฟัง",
    "japanese_title": "Easy Japanese Vlog | Slow, Natural Japanese for Listening Practice",
    "channel": "Unscripted Japanese by Ami",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 247,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "☕",
    "description": "วล็อกเล่าเรื่องราวกิจวัตรประจำวันในสตูดิโอด้วยภาษาญี่ปุ่นพูดช้า ชัดเจน และเป็นธรรมชาติสำหรับผู้เริ่มต้น (Easy Japanese N5 Beginner)",
    "jlpt_distribution": {
      "N5": 45,
      "N4": 12,
      "N3": 16,
      "N2": 3,
      "N1": 24
    }
  },
  {
    "id": "vid-n5-kids-drama-02",
    "youtube_id": "i2UEIUI3XRI",
    "title": "ละครสั้นเรียนภาษาญี่ปุ่นระดับ N5 ตอนครอบครัวและชีวิตประจำวัน",
    "japanese_title": "Learn Japanese with Short Dramas (JLPT N5)",
    "channel": "WAKU WAKU JAPANESE",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 672,
    "thumbnail_gradient": "from-teal-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🎭",
    "description": "ละครสั้นสนุกๆ สำหรับครอบครัวและเด็กเพื่อฝึกทักษะการฟังภาษาญี่ปุ่นระดับ N5 ออกเสียงชัดเจน (JLPT N5 Beginner)",
    "jlpt_distribution": {
      "N5": 59,
      "N4": 13,
      "N3": 10,
      "N2": 2,
      "N1": 16
    }
  },
  {
    "id": "vid-n5-food-curry-01",
    "youtube_id": "h8aHI9R4p0I",
    "title": "ทำข้าวแกงกะหรี่ญี่ปุ่นง่ายๆ เรียนภาษาญี่ปุ่นระดับเริ่มต้น",
    "japanese_title": "👩🏻‍🏫🇯🇵Beginner Japanese Comprehensible Input - Curry🍛",
    "channel": "Natural Japanese (NIJ)",
    "category": "Street Food",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 536,
    "thumbnail_gradient": "from-amber-950 via-yellow-950 to-stone-900",
    "scene_emoji": "🍛",
    "description": "ครูสอนทำข้าวแกงกะหรี่ญี่ปุ่นแสนอร่อยทีละขั้นตอนด้วยภาษาญี่ปุ่นช้าๆ พร้อมคำศัพท์ของกินในครัว (Beginner N5)",
    "jlpt_distribution": {
      "N5": 66,
      "N4": 8,
      "N3": 8,
      "N2": 3,
      "N1": 15
    }
  },
  {
    "id": "vid-n5-food-bento-02",
    "youtube_id": "p4BzOpv7Qtw",
    "title": "ฝึกฟังภาษาญี่ปุ่น N5: ทำข้าวกล่องเบนโตะ เล่าเรื่องงานและอากาศ",
    "japanese_title": "JLPT N5 Listening Practice 🇯🇵 Work! 👩‍💻Weather, Food | やさしい日本語",
    "channel": "Akiko_Japanese_Conversations",
    "category": "Street Food",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 540,
    "thumbnail_gradient": "from-orange-950 via-amber-950 to-slate-900",
    "scene_emoji": "🍱",
    "description": "อากิโกะเล่าเรื่องการทำข้าวกล่องเบนโตะญี่ปุ่นและชีวิตประจำวันด้วยประโยค N5 สั้นๆ ฟังเข้าใจง่าย (やさしい日本語 JLPT N5)",
    "jlpt_distribution": {
      "N5": 56,
      "N4": 16,
      "N3": 16,
      "N2": 2,
      "N1": 10
    }
  },
  {
    "id": "vid-n5-convo-konbini-01",
    "youtube_id": "cNDzCgsTeyg",
    "title": "บทสนทนาสถานการณ์จริง: แวะซื้อของที่ร้านสะดวกซื้อตอนดึก",
    "japanese_title": "Comprehensible Japanese - Midnight Konbini / Japanese Listening Practice (Beginner N5)",
    "channel": "Nihongo-Learning",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 415,
    "thumbnail_gradient": "from-cyan-950 via-blue-950 to-neutral-900",
    "scene_emoji": "🏪",
    "description": "ฝึกฟังบทสนทนาและการซื้อของในร้านสะดวกซื้อญี่ปุ่นยามค่ำคืนด้วยบทพูดช้าๆ ชัดเจน (やさしい日本語 初級 Beginner N5)",
    "jlpt_distribution": {
      "N5": 58,
      "N4": 11,
      "N3": 7,
      "N2": 1,
      "N1": 23
    }
  },
  {
    "id": "vid-n5-convo-station-02",
    "youtube_id": "0ycXiWFBCBE",
    "title": "สำรวจสถานีโตเกียว ซื้อของและของอร่อยด้วยภาษาญี่ปุ่นเข้าใจง่าย",
    "japanese_title": "【Comprehensible Japanese】Explore Tokyo Station in Simple Japanese! 東京駅Vlogでやさしい日本語を学びましょう",
    "channel": "Learn Japanese with Shufu",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 1057,
    "thumbnail_gradient": "from-slate-900 via-neutral-900 to-stone-900",
    "scene_emoji": "🚉",
    "description": "เดินเที่ยวชมสถานีรถไฟโตเกียว แวะซื้อของฝากและสั่งอาหารด้วยคำศัพท์และไวยากรณ์ระดับต้น (やさしい日本語 N5 Beginner)",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 11,
      "N3": 16,
      "N2": 4,
      "N1": 23
    }
  },
  {
    "id": "vid-n5-routine-morning-01",
    "youtube_id": "Jh2C7JlWGKU",
    "title": "กิจวัตรยามเช้าของฉัน ภาษาญี่ปุ่นสำหรับผู้เริ่มต้น",
    "japanese_title": "Comprehensible Japanese Beginner - My Morning Routine (N5)",
    "channel": "Nihongo-Learning",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 401,
    "thumbnail_gradient": "from-yellow-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🌅",
    "description": "เล่ากิจวัตรตั้งแต่ตื่นนอน เปิดผ้าม่าน ทานอาหารเช้า แปรงฟัน และแต่งตัวด้วยคำศัพท์พื้นฐาน (Beginner N5)",
    "jlpt_distribution": {
      "N5": 62,
      "N4": 11,
      "N3": 7,
      "N2": 5,
      "N1": 15
    }
  },
  {
    "id": "vid-n5-routine-news-02",
    "youtube_id": "XcgzoXpi-ms",
    "title": "ฝึกฟังภาษาญี่ปุ่น N5: เรื่องตู้กดเครื่องดื่มอัตโนมัติและรถไฟโตเกียว",
    "japanese_title": "JLPT N5 Japanese Listening Practice 🇯🇵 Easy Japanese News | Vending Machines & Tokyo Train Delay",
    "channel": "Akiko_Japanese_Conversations",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 580,
    "thumbnail_gradient": "from-blue-950 via-indigo-950 to-slate-900",
    "scene_emoji": "🥤",
    "description": "เรื่องเล่าตู้กดน้ำอัตโนมัติและการขึ้นรถไฟในญี่ปุ่นด้วยภาษาญี่ปุ่นง่ายๆ ช้าๆ สำหรับ N5 (JLPT N5 Easy Japanese)",
    "jlpt_distribution": {
      "N5": 59,
      "N4": 9,
      "N3": 19,
      "N2": 4,
      "N1": 9
    }
  },
  {
    "id": "vid-n5-routine-daily-03",
    "youtube_id": "74gGzUxOl-8",
    "title": "เรียนรู้ภาษาญี่ปุ่นเพลินๆ ผ่านเรื่องเล่าในชีวิตประจำวัน",
    "japanese_title": "You're learning Japanese without even realizing it!（Comprehensible Input N5）",
    "channel": "Japany's",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 1083,
    "thumbnail_gradient": "from-purple-950 via-violet-950 to-zinc-900",
    "scene_emoji": "✨",
    "description": "เรื่องเล่าชีวิตประจำวันและสิ่งรอบตัวด้วยประโยคพูดช้าและเป็นธรรมชาติ ช่วยให้ซึมซับภาษาญี่ปุ่นได้ง่าย (やさしい日本語 初級 Beginner N5)",
    "jlpt_distribution": {
      "N5": 51,
      "N4": 13,
      "N3": 20,
      "N2": 1,
      "N1": 15
    }
  },
  {
    "id": "vid-n5-game-stardew-01",
    "youtube_id": "5VzSoYktkh8",
    "title": "เรียนภาษาญี่ปุ่นจากเกมปลูกผัก Stardew Valley วันที่ 1",
    "japanese_title": "Learn Japanese from Stardew Valley【Day1】(Easy Japanese Beginner N5)",
    "channel": "Emma:)Japanese",
    "category": "Gaming",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "duration": 1162,
    "thumbnail_gradient": "from-emerald-950 via-green-950 to-stone-900",
    "scene_emoji": "🎮",
    "description": "ฝึกภาษาญี่ปุ่นไปกับการเล่นเกมปลูกผักยอดนิยมด้วยคำอธิบายช้าๆ ชัดเจนสำหรับผู้เริ่มต้น (Easy Japanese Beginner N5)",
    "jlpt_distribution": {
      "N5": 48,
      "N4": 16,
      "N3": 13,
      "N2": 4,
      "N1": 19
    }
  },
  {
    "id": "vid-anime-ramen-akaneko-01",
    "youtube_id": "5luX0337j94",
    "title": "ราเมงอากาเนโกะ ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【ラーメン赤猫】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 14,
      "N3": 14,
      "N2": 6,
      "N1": 23
    },
    "duration": 1400,
    "thumbnail_gradient": "from-red-950 via-orange-950 to-slate-900",
    "scene_emoji": "🍜",
    "description": "ทามาโกะหญิงสาวที่ตอบอย่างตรงไปตรงมาว่าชอบสุนัข ได้รับเข้าทำงานพาร์ตไทม์คอยดูแลเหล่าแมวพนักงานในร้านราเมงอากาเนโกะที่มีแต่แมวบริหารร้าน"
  },
  {
    "id": "vid-anime-ramen-akaneko-02",
    "youtube_id": "BNWs_UfzFXA",
    "title": "ราเมงอากาเนโกะ ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【ラーメン赤猫】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 11,
      "N3": 15,
      "N2": 4,
      "N1": 24
    },
    "duration": 1400,
    "thumbnail_gradient": "from-red-950 via-orange-950 to-slate-900",
    "scene_emoji": "🍜",
    "description": "เรื่องราวการทำงานในร้านราเมงอากาเนโกะที่เต็มไปด้วยความอบอุ่น การดูแลขนให้เหล่าพนักงานแมว และบทสนทนาประจำวันกับลูกค้า"
  },
  {
    "id": "vid-anime-pseudo-harem-01",
    "youtube_id": "mTrFxmtFiig",
    "title": "ฮาเร็มนี้มีแต่เธอ ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【疑似ハーレム】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 17,
      "N3": 16,
      "N2": 3,
      "N1": 26
    },
    "duration": 1432,
    "thumbnail_gradient": "from-pink-950 via-rose-950 to-slate-900",
    "scene_emoji": "🏫",
    "description": "นานาคุระ ริน รุ่นน้องชมรมการแสดงที่แอบชอบรุ่นพี่คิตาฮามะ เอย์จิ จึงแกล้งสวมบทบาทสารพัดบุคลิกให้เหมือนฮาเร็มในชีวิตจริง"
  },
  {
    "id": "vid-anime-pseudo-harem-02",
    "youtube_id": "ZC3S742N5vY",
    "title": "ฮาเร็มนี้มีแต่เธอ ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【疑似ハーレム】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 15,
      "N3": 13,
      "N2": 4,
      "N1": 26
    },
    "duration": 1431,
    "thumbnail_gradient": "from-pink-950 via-rose-950 to-slate-900",
    "scene_emoji": "🏫",
    "description": "ชีวิตประจำวันในชมรมการแสดงโรงเรียนมัธยมปลายกับบทสนทนาหยอกล้อสุดน่ารักระหว่างรินและรุ่นพี่เอย์จิ"
  },
  {
    "id": "vid-anime-crush-work-01",
    "youtube_id": "ZNaymNmP8u8",
    "title": "บริษัทนี้มีคนแอบรัก ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【この会社に好きな人がいます】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 13,
      "N3": 17,
      "N2": 5,
      "N1": 26
    },
    "duration": 1431,
    "thumbnail_gradient": "from-blue-950 via-indigo-950 to-slate-900",
    "scene_emoji": "💼",
    "description": "ทาเทอิชิ พนักงานหนุ่มฝ่ายบัญชีและมิตสึยะ สาวฝ่ายวางแผนที่เป็นคู่กัดกันในที่ทำงาน แต่ความจริงแล้วทั้งคู่แอบคบกันเป็นความลับ"
  },
  {
    "id": "vid-anime-crush-work-02",
    "youtube_id": "6B4Oir6aA4k",
    "title": "บริษัทนี้มีคนแอบรัก ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【この会社に好きな人がいます】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 34,
      "N4": 16,
      "N3": 17,
      "N2": 6,
      "N1": 27
    },
    "duration": 1432,
    "thumbnail_gradient": "from-blue-950 via-indigo-950 to-slate-900",
    "scene_emoji": "💼",
    "description": "เรื่องราวการทำงานในบริษัทขนมและการเก็บความลับความสัมพันธ์ของคู่รักวัยทำงานในออฟฟิศ"
  },
  {
    "id": "vid-anime-umaru-01",
    "youtube_id": "td_9L0hmu6k",
    "title": "น้องสาวสุดติ่ง อุมารุจัง ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【干物妹！うまるちゃん】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 12,
      "N3": 20,
      "N2": 5,
      "N1": 27
    },
    "duration": 1445,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-zinc-900",
    "scene_emoji": "🏠",
    "description": "โดมะ อุมารุ นักเรียนมัธยมปลายที่ภายนอกดูสมบูรณ์แบบทุกด้าน แต่พอกลับถึงบ้านจะกลายร่างเป็นน้องสาวจอมขี้เกียจที่อยู่กับพี่ชายไทเฮ"
  },
  {
    "id": "vid-anime-umaru-02",
    "youtube_id": "J__555ipXA8",
    "title": "น้องสาวสุดติ่ง อุมารุจัง ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【干物妹！うまるちゃん】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 13,
      "N3": 19,
      "N2": 4,
      "N1": 28
    },
    "duration": 1445,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-zinc-900",
    "scene_emoji": "🏠",
    "description": "ชีวิตประจำวันแสนวุ่นวายในบ้านและที่โรงเรียนของอุมารุกับเพื่อนร่วมชั้นและพี่ชายสุดใจดี"
  },
  {
    "id": "vid-anime-tadaima-okaeri-01",
    "youtube_id": "5p6GA_IH7Vc",
    "title": "กลับมาแล้วครับ ยินดีต้อนรับกลับบ้าน ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【ただいま、おかえり】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 18,
      "N3": 17,
      "N2": 5,
      "N1": 23
    },
    "duration": 1421,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-slate-900",
    "scene_emoji": "🏠",
    "description": "เรื่องราวชีวิตครอบครัวอันอบอุ่นของมาซากิ พ่อบ้านที่ดูแลลูกน้อยวัยเกือบสองขวบและย้ายมาใช้ชีวิตในเมืองชานเมืองร่วมกับฮิโรมุผู้เป็นสามี"
  },
  {
    "id": "vid-anime-tadaima-okaeri-02",
    "youtube_id": "qVpjaVH2Bfc",
    "title": "กลับมาแล้วครับ ยินดีต้อนรับกลับบ้าน ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【ただいま、おかえり】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 19,
      "N3": 17,
      "N2": 5,
      "N1": 21
    },
    "duration": 1421,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-slate-900",
    "scene_emoji": "🏠",
    "description": "ชีวิตประจำวันแสนละมุนของการเลี้ยงลูก การทำกับข้าว และการพูดคุยกับเพื่อนบ้านในครอบครัวฟุจิโยชิ"
  },
  {
    "id": "vid-anime-sorairo-utility-01",
    "youtube_id": "yRq7g_UKzco",
    "title": "โซระอิโระ ยูทิลิตี้ ตอนที่ 1 (Ani-One Asia)",
    "japanese_title": "【空色ユーティリティ】第1話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 16,
      "N3": 15,
      "N2": 3,
      "N1": 27
    },
    "duration": 1421,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "⛳",
    "description": "อาโอบะ มินามิ เด็กสาวมัธยมปลายที่ยังหาสิ่งที่ชอบไม่เจอ บังเอิญได้ลองเล่นกอล์ฟที่สนามฝึกซ้อมและพบกับเพื่อนใหม่"
  },
  {
    "id": "vid-anime-sorairo-utility-02",
    "youtube_id": "IXLb9Buv66o",
    "title": "โซระอิโระ ยูทิลิตี้ ตอนที่ 2 (Ani-One Asia)",
    "japanese_title": "【空色ユーティリティ】第2話 (Ani-One Asia)",
    "channel": "Ani-One Asia",
    "category": "Anime",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 14,
      "N3": 13,
      "N2": 4,
      "N1": 25
    },
    "duration": 1421,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "⛳",
    "description": "มิตรภาพและการฝึกซ้อมกอล์ฟหลังเลิกเรียนของมินามิ ฮารุกะ และอายากะในบรรยากาศสบายๆ"
  },
  {
    "id": "vid-yt-hikakin-02",
    "youtube_id": "0jmId7CsPnE",
    "title": "เขาว่าโซบะเย็นพริกไทยของเซเว่นเค็มที่สุด",
    "japanese_title": "セブンの冷やしコショウそばが最強にしょっぱいらしい",
    "channel": "HikakinTV",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 13,
      "N3": 17,
      "N2": 5,
      "N1": 25
    },
    "duration": 689,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🍜",
    "description": "ฮิคาคินลองชิมโซบะเย็นพริกไทยของเซเว่นอีเลฟเว่นที่ลือกันว่าเค็มจัด"
  },
  {
    "id": "vid-yt-hikakin-03",
    "youtube_id": "h23VZ7SmTOE",
    "title": "บริจาค 20 ล้านเยนช่วยเหตุแผ่นดินไหวคุมาโมโตะ",
    "japanese_title": "熊本地震に2000万円寄付させていただきました。ヒカキンと一緒に支援の輪を広げませんか？",
    "channel": "HikakinTV",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 15,
      "N3": 24,
      "N2": 1,
      "N1": 23
    },
    "duration": 413,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🤝",
    "description": "ฮิคาคินเล่าเรื่องการบริจาคช่วยผู้ประสบภัยแผ่นดินไหวคุมาโมโตะและชวนผู้ชมร่วมช่วยกัน"
  },
  {
    "id": "vid-yt-seikin-01",
    "youtube_id": "cFHQRHa9lJE",
    "title": "ยางระเบิดระหว่างขับบนทางด่วนชุโตะโค",
    "japanese_title": "首都高を走行中にタイヤがバーストしました。",
    "channel": "SeikinTV",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 17,
      "N3": 23,
      "N2": 4,
      "N1": 19
    },
    "duration": 614,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🚗",
    "description": "เซคินเล่าเหตุการณ์ยางรถระเบิดขณะขับอยู่บนทางด่วนในโตเกียว"
  },
  {
    "id": "vid-yt-tokai-03",
    "youtube_id": "wwqesWN1kKo",
    "title": "ส่งอากาศให้กันแบบปากต่อปากใต้น้ำ ทำได้จริงไหม?",
    "japanese_title": "水中で口移しで空気を受け渡しするアレ、本当か？",
    "channel": "東海オンエア",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 15,
      "N3": 16,
      "N2": 4,
      "N1": 22
    },
    "duration": 564,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🫧",
    "description": "โทไคออนแอร์ทดลองส่งอากาศให้กันใต้น้ำแบบที่เห็นในหนังว่าทำได้จริงหรือเปล่า"
  },
  {
    "id": "vid-yt-comdot-01",
    "youtube_id": "FV_cHc_3j7E",
    "title": "ยามาโตะประกาศความฝันที่โตเกียวโดม",
    "japanese_title": "【CDF2026】やまと夢の宣言「夢なんてあってもなくてもいい」@東京ドーム",
    "channel": "コムドット",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 25,
      "N3": 14,
      "N2": 5,
      "N1": 21
    },
    "duration": 270,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🎤",
    "description": "ยามาโตะแห่งคอมดอตพูดบนเวทีโตเกียวโดมว่าความฝันจะมีหรือไม่มีก็ได้"
  },
  {
    "id": "vid-yt-quizknock-01",
    "youtube_id": "jE-XRp5BSFM",
    "title": "ควิซที่ทั้งโจทย์และคะแนนใหญ่เกินไป",
    "japanese_title": "問題文も得点もデカすぎるクイズ【ネタバレ：優勝者の得点は39兆！】",
    "channel": "QuizKnock",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 16,
      "N3": 22,
      "N2": 3,
      "N1": 24
    },
    "duration": 822,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🧠",
    "description": "QuizKnock แข่งตอบควิซที่ตัวเลขทั้งในโจทย์และคะแนนใหญ่มหาศาล"
  },
  {
    "id": "vid-yt-quizknock-02",
    "youtube_id": "KVYiNd0PObw",
    "title": "เอานิทานอิกคิวซังเรื่องที่ไม่ดังมาทำควิซ",
    "japanese_title": "【理不尽】一休さんのとんち話の有名じゃないやつクイズにしたらツッコミの嵐に",
    "channel": "QuizKnock",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 14,
      "N3": 16,
      "N2": 3,
      "N1": 21
    },
    "duration": 659,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🧠",
    "description": "QuizKnock ตอบควิซจากนิทานปฏิภาณของอิกคิวซังเรื่องที่คนไม่ค่อยรู้จัก พร้อมเสียงแซวเพียบ"
  },
  {
    "id": "vid-yt-quizknock-03",
    "youtube_id": "zfD6GEnclqE",
    "title": "เพิ่มกฎตกรอบไปเรื่อย ๆ จนสถานการณ์เกินคาด",
    "japanese_title": "【第2回】失格のルールを追加し続けたら、予想外の状況になった【退場】【脱落】【アウト】【失格】",
    "channel": "QuizKnock",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 13,
      "N3": 17,
      "N2": 5,
      "N1": 23
    },
    "duration": 926,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🧠",
    "description": "QuizKnock เล่นเกมที่เพิ่มกฎตกรอบขึ้นเรื่อย ๆ ครั้งที่ 2"
  },
  {
    "id": "vid-yt-hikakingames-01",
    "youtube_id": "J7gGfJj_Ha0",
    "title": "มอนสไตรค์: เปิดกาชาฉลอง 13 ปีพร้อมกัน 4 เครื่อง",
    "japanese_title": "【モンスト】13周年轟絶感謝マルチガチャを4端末\"彩獣神祭\"引いたらまさかの!?【ヒカキンゲームズ】",
    "channel": "HikakinGames",
    "category": "YouTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 9,
      "N3": 15,
      "N2": 6,
      "N1": 31
    },
    "duration": 747,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🎰",
    "description": "ฮิคาคินเปิดกาชาฉลองครบรอบ 13 ปีของเกมมอนสเตอร์สไตรค์ด้วยมือถือ 4 เครื่อง"
  },
  {
    "id": "vid-vt-hololive-anime-01",
    "youtube_id": "NQc2ULvq7-k",
    "title": "อนิเมะสั้นโฮโลไลฟ์: ขอประกาศให้ที่นี่เป็นอาณาจักรฟุบุคิง!",
    "japanese_title": "【アニメ】ここをフブキングダムとする！！【みろくの里】",
    "channel": "hololive ホロライブ - VTuber Group",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 29,
      "N4": 11,
      "N3": 15,
      "N2": 4,
      "N1": 41
    },
    "duration": 201,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🦊",
    "description": "อนิเมะสั้นของโฮโลไลฟ์ที่ฟุบุกิประกาศตั้งอาณาจักรฟุบุคิง"
  },
  {
    "id": "vid-vt-pekora-01",
    "youtube_id": "5XVavftwhps",
    "title": "เปโกระแข่งรถจริงจังใน Racing Master",
    "japanese_title": "【爆走】ぺこら、レーシングマスター案件でガチレース！最速の座を目指して大爆走！【兎田ぺこら／レーシングマスター】",
    "channel": "Pekora Ch. 兎田ぺこら",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 31,
      "N4": 16,
      "N3": 17,
      "N2": 3,
      "N1": 33
    },
    "duration": 419,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🏎️",
    "description": "อุซาดะ เปโกระลองเล่นเกมแข่งรถ Racing Master และซิ่งชิงตำแหน่งเร็วที่สุด"
  },
  {
    "id": "vid-vt-pekora-02",
    "youtube_id": "_LYJzjQMpf8",
    "title": "PRAGMATA: จับคู่กับไดอาน่าจังที่น่ารักเกินไป",
    "japanese_title": "【プラグマタ】可愛すぎるディアナちゃんとバディになりました。【爆誕！月バディ】",
    "channel": "Pekora Ch. 兎田ぺこら",
    "category": "VTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 30,
      "N4": 17,
      "N3": 13,
      "N2": 5,
      "N1": 35
    },
    "duration": 399,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🌙",
    "description": "อุซาดะ เปโกระเล่นเกม PRAGMATA และได้เป็นคู่หูกับไดอาน่า"
  },
  {
    "id": "vid-vt-marine-01",
    "youtube_id": "B-2CyliwRVo",
    "title": "กัปตันมารีนกินราเม็งอิจิรันครั้งแรกในชีวิต",
    "japanese_title": "人生初の一蘭を食べるマリン船長🍜",
    "channel": "Marine Ch. 宝鐘マリン hololive3期生",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 14,
      "N3": 18,
      "N2": 5,
      "N1": 23
    },
    "duration": 770,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🍜",
    "description": "โฮโช มารีนไปกินราเม็งร้านอิจิรันเป็นครั้งแรกและเล่าความรู้สึก"
  },
  {
    "id": "vid-vt-korone-01",
    "youtube_id": "IDPvStA2B_8",
    "title": "รีวิวหนังใหม่ '28 Years Later: The Bone Temple'",
    "japanese_title": "【新作映画レビュー】遂に1月16日公開！！「#28年後…白骨の神殿」の魅力を語る！",
    "channel": "Korone Ch. 戌神ころね",
    "category": "VTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 12,
      "N3": 22,
      "N2": 4,
      "N1": 27
    },
    "duration": 570,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🎬",
    "description": "อินุกามิ โคโรเนะเล่าเสน่ห์ของหนัง 28 Years Later: The Bone Temple ก่อนเข้าฉาย"
  },
  {
    "id": "vid-vt-korone-02",
    "youtube_id": "Y7YHa0HMilY",
    "title": "ไปดูหนัง 'WEAPONS' มาแล้ว ขอเล่าความรู้สึก",
    "japanese_title": "【超話題作★】映画『WEAPONS／ウェポンズ』見てきたので感想言いたい～～♩【新作映画レビュー】",
    "channel": "Korone Ch. 戌神ころね",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 12,
      "N3": 19,
      "N2": 3,
      "N1": 25
    },
    "duration": 462,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🎬",
    "description": "อินุกามิ โคโรเนะรีวิวหนัง WEAPONS หลังไปดูมา"
  },
  {
    "id": "vid-vt-korone-03",
    "youtube_id": "r5YXhrkXn9k",
    "title": "แนะนำหนัง 'Johnny Got His Gun' ที่กลับมาฉายโรง",
    "japanese_title": "【映画紹介】鬱映画代表の『ジョニーは戦場へ行った』が今なら劇場で観れるぞ！！！",
    "channel": "Korone Ch. 戌神ころね",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 17,
      "N3": 20,
      "N2": 2,
      "N1": 22
    },
    "duration": 427,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🎬",
    "description": "อินุกามิ โคโรเนะแนะนำหนังหดหู่ระดับตำนาน Johnny Got His Gun ที่กลับมาฉายในโรง"
  },
  {
    "id": "vid-vt-okayu-01",
    "youtube_id": "IixrJzaYlLc",
    "title": "โอคายุตั้งใจสุด ๆ ในเกมแข่งรถ Racing Master",
    "japanese_title": "【奮闘】レースゲームでも一生懸命！頑張って走るおかゆがかわいすぎる【猫又おかゆ／レーシングマスター】",
    "channel": "Okayu Ch. 猫又おかゆ",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 15,
      "N3": 16,
      "N2": 2,
      "N1": 31
    },
    "duration": 374,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🏎️",
    "description": "เนโกะมาตะ โอคายุพยายามเต็มที่ในเกมแข่งรถ Racing Master"
  },
  {
    "id": "vid-yt-pokemon-01",
    "youtube_id": "MNZFORWk2IQ",
    "title": "ทดลอง: ฝืนลงหลุมใหญ่พัลเดียตั้งแต่ต้นเกม",
    "japanese_title": "【検証】序盤でパルデアの大穴に無理やり入ってみた結果ww【ポケモンSV/スカバイ】",
    "channel": "ひとりぃのゲーム実況は、いとをかし。",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 40,
      "N4": 16,
      "N3": 13,
      "N2": 3,
      "N1": 28
    },
    "duration": 232,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🕳️",
    "description": "ทดลองฝืนเข้าไปในหลุมใหญ่แห่งพัลเดียตั้งแต่ช่วงต้นเกมโปเกมอนสการ์เล็ต/ไวโอเล็ต"
  },
  {
    "id": "vid-yt-mic-01",
    "youtube_id": "awi-lRwHIZw",
    "title": "ทดลองใช้ไมค์เก็บเสียง ร้องคาราโอเกะคนเดียวที่บ้าน",
    "japanese_title": "【検証】防音マイクを使ってみた！家で一人カラオケ！家でボイトレ！",
    "channel": "友近890[やっくん]@日本12周目",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 48,
      "N4": 12,
      "N3": 12,
      "N2": 4,
      "N1": 24
    },
    "duration": 215,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🎙️",
    "description": "ทดลองใช้ไมค์เก็บเสียงสำหรับร้องคาราโอเกะและฝึกร้องเพลงที่บ้าน"
  },
  {
    "id": "vid-yt-yuuri-01",
    "youtube_id": "evNoJ1KVbUc",
    "title": "ปรึกษายูริว่าอยากทำศัลยกรรม คำตอบเกินคาด",
    "japanese_title": "【検証】優里に整形したいと相談したら答えが想像以上だった…",
    "channel": "優里ちゃんねる【公式】",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 16,
      "N3": 15,
      "N2": 4,
      "N1": 27
    },
    "duration": 868,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "💬",
    "description": "ทดลองปรึกษานักร้องยูริเรื่องอยากทำศัลยกรรม แล้วดูว่าเขาจะตอบอย่างไร"
  },
  {
    "id": "vid-yt-iphoneair-01",
    "youtube_id": "R0JS9XoUlM8",
    "title": "iPhone Air มือสองตอนนี้น่าซื้อไหม? รีวิวปี 2026",
    "japanese_title": "iPhone Air、中古等で安く買える今ならアリ？2026年の使用感レビュー",
    "channel": "電子レンジマン",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 34,
      "N4": 10,
      "N3": 24,
      "N2": 7,
      "N1": 25
    },
    "duration": 679,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "📱",
    "description": "รีวิวการใช้งาน iPhone Air ในปี 2026 ว่าคุ้มไหมถ้าซื้อมือสองราคาถูก"
  },
  {
    "id": "vid-yt-iphone14-01",
    "youtube_id": "E0erpzFIa3g",
    "title": "รีวิว iPhone 14 Pro ในปี 2026 ยังใช้ได้อยู่ไหม",
    "japanese_title": "【まだまだ現役】2026年にiPhone 14 Proをレビュー！！【スマホレビュー】",
    "channel": "UzuheMayuri",
    "category": "YouTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 23,
      "N4": 9,
      "N3": 20,
      "N2": 5,
      "N1": 43
    },
    "duration": 816,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "📱",
    "description": "รีวิว iPhone 14 Pro ในปี 2026 ว่ายังใช้งานได้ดีอยู่หรือเปล่า"
  },
  {
    "id": "vid-yt-daiso-01",
    "youtube_id": "QJQNuA2ngeE",
    "title": "ของใหม่ไดโซ: อุปกรณ์ครัวและของจัดเก็บที่ใช้ได้หลายแบบ",
    "japanese_title": "【ダイソー購入品】すごいの出た！新商品のキッチングッズや収納アイテムがマルチに使える！",
    "channel": "池田真子 / 整理収納アドバイザーの暮らし",
    "category": "YouTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 13,
      "N3": 18,
      "N2": 4,
      "N1": 21
    },
    "duration": 861,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🛒",
    "description": "ที่ปรึกษาด้านการจัดเก็บรีวิวสินค้าใหม่จากร้านไดโซ ทั้งอุปกรณ์ครัวและของจัดเก็บ"
  },
  {
    "id": "vid-yt-fischers-01",
    "youtube_id": "OFuyGs6TRuM",
    "title": "แกล้งกัน: เจอหมีตัวใหญ่ในป่า",
    "japanese_title": "【ドッキリ】森の中で大きなクマさんに出会った時の反応が異常すぎた！？ Meat a bear prank",
    "channel": "Fischer's",
    "category": "YouTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 9,
      "N3": 11,
      "N2": 3,
      "N1": 41
    },
    "duration": 609,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🐻",
    "description": "Fischer's แกล้งเพื่อนด้วยหมีตัวใหญ่ในป่าแล้วดูปฏิกิริยา"
  },
  {
    "id": "vid-yt-fischers-02",
    "youtube_id": "XChkg6WAkGw",
    "title": "แกล้งกัน: ปล่อยหนูจริง 100 ตัวในห้อง",
    "japanese_title": "【ドッキリ】いきなり部屋にマジネズミ100匹放出してみた。",
    "channel": "Fischer's",
    "category": "YouTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 13,
      "N3": 15,
      "N2": 5,
      "N1": 32
    },
    "duration": 815,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🐭",
    "description": "Fischer's แกล้งเพื่อนด้วยการปล่อยหนูจริง 100 ตัวเข้าไปในห้อง"
  },
  {
    "id": "vid-yt-kishitakano-01",
    "youtube_id": "QclqCF8nPME",
    "title": "แกล้งกัน: โฆษณา YouTube เป็นของปลอมทั้งหมด",
    "japanese_title": "【ドッキリ】YouTubeの広告が全部嘘で怒らせたい。【きしたかの】",
    "channel": "高野さんを怒らせたい。【きしたかの】",
    "category": "YouTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 11,
      "N3": 16,
      "N2": 3,
      "N1": 32
    },
    "duration": 755,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "😡",
    "description": "คู่ตลกคิชิทากาโนะแกล้งทาคาโนะด้วยโฆษณา YouTube ปลอมเพื่อให้โกรธ"
  },
  {
    "id": "vid-yt-egachan-01",
    "youtube_id": "kqF5bqnwJYo",
    "title": "ศึกกินจุ: เอกาชิระ 2:50 ปะทะ รัสเซียน ซาโต้",
    "japanese_title": "【大食い対決】江頭2:50 vs ロシアン佐藤！ステーキを食べまくる男たちの激闘！",
    "channel": "エガちゃん伝説【公認切り抜き】",
    "category": "YouTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 15,
      "N3": 17,
      "N2": 3,
      "N1": 22
    },
    "duration": 867,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🥩",
    "description": "เอกาชิระ 2:50 แข่งกินสเต๊กกับนักกินจุรัสเซียน ซาโต้"
  },
  {
    "id": "vid-vt-pekora-03",
    "youtube_id": "FkuDnUYLq6c",
    "title": "เผยโฉมโมเดล 3D ใหม่ของอุซาดะ เปโกระ",
    "japanese_title": "超美麗!! 兎田ぺこら新3Dお披露目!?（3D SHOWCASE）",
    "channel": "Pekora Ch. 兎田ぺこら",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 11,
      "N3": 15,
      "N2": 4,
      "N1": 31
    },
    "duration": 224,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🐰",
    "description": "คลิปเปิดตัวโมเดล 3D ใหม่ของอุซาดะ เปโกระ"
  },
  {
    "id": "vid-vt-fubuki-01",
    "youtube_id": "UTMAXfTb8bI",
    "title": "ลองดูหนังเรต R เรื่องนั้นกัน (Deadpool & Wolverine)",
    "japanese_title": "【子どもは見ちゃダメ】あのR指定映画を見てみよう【#デッドプールウルヴァリン】",
    "channel": "フブキCh。白上フブキ",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 11,
      "N3": 14,
      "N2": 4,
      "N1": 32
    },
    "duration": 400,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🎬",
    "description": "ชิรากามิ ฟุบุกิพูดถึงหนัง Deadpool & Wolverine ที่จัดเรต R"
  },
  {
    "id": "vid-vt-sora-01",
    "youtube_id": "OoJkGWCcyog",
    "title": "เบื้องหลังการอัดเพลง Kirameki MODE! ของโทคิโนะ โซระ",
    "japanese_title": "ときのそら×響咲リオナ×TeddyLoid｜”キラメキMODE！” Recording Behind the Scenes",
    "channel": "SoraCh. ときのそらチャンネル",
    "category": "VTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 15,
      "N3": 14,
      "N2": 5,
      "N1": 27
    },
    "duration": 486,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "เบื้องหลังการอัดเสียงเพลง Kirameki MODE! ของโทคิโนะ โซระ ฮิบิกิ ริโอนะ และ TeddyLoid"
  },
  {
    "id": "vid-vt-aqua-01",
    "youtube_id": "WWFJ1hCA6tw",
    "title": "ตอนที่ 4: ตอนหน้า มินาโตะ อควา สิ้นชีพ",
    "japanese_title": "#4次回、湊あくあ 氏す。",
    "channel": "Aqua Ch. 湊あくあ",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 45,
      "N4": 17,
      "N3": 12,
      "N2": 3,
      "N1": 23
    },
    "duration": 525,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "⚓",
    "description": "คลิปซีรีส์ตอนที่ 4 ของมินาโตะ อควา"
  },
  {
    "id": "vid-vt-aqua-02",
    "youtube_id": "WXyElMlCVxU",
    "title": "ตอนที่ 3: ฉบับหนังโรง ศึกชิงตำแหน่งภรรยาหลวงเริ่มแล้ว",
    "japanese_title": "#3劇場版あてぃし、正妻戦争始まるー・・・！",
    "channel": "Aqua Ch. 湊あくあ",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 15,
      "N3": 13,
      "N2": 3,
      "N1": 26
    },
    "duration": 641,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "⚓",
    "description": "คลิปซีรีส์ตอนที่ 3 ของมินาโตะ อควา"
  },
  {
    "id": "vid-vt-towa-01",
    "youtube_id": "WbQkQAw9m3Y",
    "title": "รวมช็อตฮาตอนทีมโทวะซ้อม Fall Guys",
    "japanese_title": "【 #ホロ新春ゲーム祭2025 】パッションイングリッシュで和気藹々とファイナルを目指すトワチームのFALLGUYS練習面白まとめ",
    "channel": "Towa Ch.Tokoyami Towa",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 16,
      "N3": 10,
      "N2": 4,
      "N1": 34
    },
    "duration": 700,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "👑",
    "description": "รวมช่วงสนุก ๆ ตอนทีมของโทโคยามิ โทวะซ้อมเกม Fall Guys ก่อนงานแข่งเกมปีใหม่โฮโลไลฟ์ 2025"
  },
  {
    "id": "vid-vt-nene-01",
    "youtube_id": "3YEiaDBqe6k",
    "title": "นึกว่าลองที่นอน NELL ครั้งแรก แต่เนเนะหลับไปแล้ว",
    "japanese_title": "【NELLマットレス】初めてのNELLかと思ったら、すでに寝ていた桃鈴ねね【 桃鈴ねね / 雪花ラミィ】",
    "channel": "Nene Ch.桃鈴ねね",
    "category": "VTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 16,
      "N3": 16,
      "N2": 6,
      "N1": 24
    },
    "duration": 477,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🛏️",
    "description": "โมโมะซึซึ เนเนะกับยูกิฮานะ ลามี่รีวิวที่นอน NELL"
  },
  {
    "id": "vid-vt-botan-01",
    "youtube_id": "Ir8kqyd8MCY",
    "title": "ย้อนดูปี 2021 ของชิชิโระ โบตันผ่านคลิปตัด",
    "japanese_title": "切り抜きで獅白ぼたんの2021年を振り返ってみよう！【Clips総集編】",
    "channel": "Botan Ch.獅白ぼたん",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 13,
      "N3": 16,
      "N2": 4,
      "N1": 32
    },
    "duration": 562,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🦁",
    "description": "รวมคลิปตัดย้อนดูปี 2021 ของชิชิโระ โบตัน"
  },
  {
    "id": "vid-vt-polka-01",
    "youtube_id": "oYTKz2Gb2vo",
    "title": "ตำนานโพลก้า: ควิซสลับตัวอักษรชื่อเมมเบอร์โฮโลไลฟ์",
    "japanese_title": "【ポルカの伝説】入れ替えて答えて！ホロメンアナグラムクイズ！",
    "channel": "Polka Ch. 尾丸ポルカ",
    "category": "VTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 17,
      "N3": 13,
      "N2": 4,
      "N1": 29
    },
    "duration": 606,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🎪",
    "description": "โอมารุ โพลก้าจัดควิซสลับตัวอักษรชื่อเมมเบอร์โฮโลไลฟ์"
  },
  {
    "id": "vid-vt-polka-02",
    "youtube_id": "ciE3XuAWbp8",
    "title": "ตำนานโพลก้า: อยากรู้วิธีประหยัดเงินของทุกคน",
    "japanese_title": "【ポルカの伝説】みんなの節約術が知りたい！！！！",
    "channel": "Polka Ch. 尾丸ポルカ",
    "category": "VTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 15,
      "N3": 18,
      "N2": 4,
      "N1": 25
    },
    "duration": 575,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🎪",
    "description": "โอมารุ โพลก้าคุยเรื่องเคล็ดลับการประหยัดเงิน"
  },
  {
    "id": "vid-vt-polka-03",
    "youtube_id": "PY7_JVQ2hKE",
    "title": "ตำนานโพลก้า: ดราฟต์กับแกล้มกลับมาแล้ว",
    "japanese_title": "【ポルカの伝説】帰ってきたおつまみドラフト！？！！？",
    "channel": "Polka Ch. 尾丸ポルカ",
    "category": "VTuber",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 14,
      "N3": 17,
      "N2": 4,
      "N1": 28
    },
    "duration": 832,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🎪",
    "description": "โอมารุ โพลก้าจัดดราฟต์เลือกกับแกล้มอีกครั้ง"
  },
  {
    "id": "vid-vt-laplus-01",
    "youtube_id": "KTk3NOCGEdc",
    "title": "สาวน้อยเวทมนตร์ตัวจริงคืออะไร ชวนผู้ใหญ่ 10 คนมาตัดสิน",
    "japanese_title": "真の魔法少女とはなんなのか大人10人集めて決めてみた切り抜き動画です。【ラプ様/蛇足/千燈ゆうひ/アステル/天鬼ぷるる/水無瀬/赤見かるび/しんじ/高木/けんき/valorant】",
    "channel": "Laplus ch. ラプラス・ダークネス - holoX -",
    "category": "VTuber",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 11,
      "N3": 17,
      "N2": 3,
      "N1": 31
    },
    "duration": 833,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "😈",
    "description": "คลิปตัดจากช่องลาพลัส ดาร์กเนส ที่ชวนคน 10 คนมาถกกันว่าสาวน้อยเวทมนตร์ตัวจริงคืออะไร"
  },
  {
    "id": "vid-vt-lui-01",
    "youtube_id": "6hSiqQtCd98",
    "title": "ลุยกับโบตันไปกินอาหารกลางวันโรงเรียนสุดคิดถึง",
    "japanese_title": "【爆食い！】ししルイで懐かしの学校給食を食べてきた！【ルイ姉、今日なにする？】#7",
    "channel": "Lui ch. 鷹嶺ルイ - holoX -",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 15,
      "N3": 14,
      "N2": 6,
      "N1": 21
    },
    "duration": 676,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🍱",
    "description": "ทาคาเนะ ลุยกับชิชิโระ โบตันไปกินอาหารกลางวันโรงเรียนแบบสมัยก่อน ในรายการพี่ลุยวันนี้ทำอะไรดี ตอนที่ 7"
  },
  {
    "id": "vid-vt-lui-02",
    "youtube_id": "ZNzyrv24iVI",
    "title": "ลุยกับโอคายุกินหม่าล่าทังร้านหยางกั๋วฝูครั้งแรก",
    "japanese_title": "【初体験！】ねこたかで初めての楊国福麻辣湯で大好きなマーラータンを爆食✨【ルイ姉、今日なにする？】#5",
    "channel": "Lui ch. 鷹嶺ルイ - holoX -",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 21,
      "N3": 13,
      "N2": 4,
      "N1": 24
    },
    "duration": 765,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "🌶️",
    "description": "ทาคาเนะ ลุยกับเนโกะมาตะ โอคายุไปกินหม่าล่าทังร้านหยางกั๋วฝูเป็นครั้งแรก ในรายการพี่ลุยวันนี้ทำอะไรดี ตอนที่ 5"
  },
  {
    "id": "vid-vt-lui-03",
    "youtube_id": "kSVbWIgVqK0",
    "title": "ทนร้อนออกไปถ่ายรูปล่าสีด้วยกล้องของตัวเอง",
    "japanese_title": "【SNSで話題！】暑さに耐えながらMYカメラでカラーハンティング📷✨【ルイ姉、今日なにする？】#4",
    "channel": "Lui ch. 鷹嶺ルイ - holoX -",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 45,
      "N4": 13,
      "N3": 13,
      "N2": 4,
      "N1": 25
    },
    "duration": 666,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "📷",
    "description": "ทาคาเนะ ลุยออกไปถ่ายรูปตามหาสีต่าง ๆ ด้วยกล้องของตัวเองกลางอากาศร้อน ในรายการพี่ลุยวันนี้ทำอะไรดี ตอนที่ 4"
  },
  {
    "id": "vid-vt-mio-01",
    "youtube_id": "fbLcevnyF2w",
    "title": "บุกปลุกตอนเพิ่งตื่นของจริง แบบไม่ใส่เพลงประกอบ",
    "japanese_title": "ガチの寝起き凸 ※あえてBGMなど付けずそのままお届け",
    "channel": "Mio Channel 大神ミオ",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 16,
      "N3": 19,
      "N2": 2,
      "N1": 26
    },
    "duration": 505,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🐺",
    "description": "คลิปบุกปลุกตอนเพิ่งตื่นจากช่องโอคามิ มิโอะ ปล่อยแบบไม่ใส่เพลงประกอบ"
  },
  {
    "id": "vid-vt-mio-02",
    "youtube_id": "G-9qlbpIezo",
    "title": "โอคามิ มิโอะ สู่เส้นทางหมอดูมืออาชีพ: ภาคปฏิบัติ",
    "japanese_title": "【第1.5回】大神ミオ、プロ占い師への道  ～教えて！R.I.O.N先生！～【実践講座編】",
    "channel": "Mio Channel 大神ミオ",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 15,
      "N3": 19,
      "N2": 3,
      "N1": 26
    },
    "duration": 770,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🔮",
    "description": "โอคามิ มิโอะเรียนดูดวงภาคปฏิบัติกับอาจารย์ R.I.O.N ตอนที่ 1.5"
  },
  {
    "id": "vid-vt-hololive-anime-02",
    "youtube_id": "4foCLbBypYw",
    "title": "อนิเมะสั้นโฮโลไลฟ์: งานกีฬาสีที่มีแต่การโกง",
    "japanese_title": "【アニメ】反則だらけの大運動会",
    "channel": "hololive ホロライブ - VTuber Group",
    "category": "VTuber",
    "difficulty_rating": 5,
    "primary_jlpt": "N1",
    "jlpt_distribution": {
      "N5": 23,
      "N4": 10,
      "N3": 16,
      "N2": 5,
      "N1": 46
    },
    "duration": 192,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🏃",
    "description": "อนิเมะสั้นของโฮโลไลฟ์เรื่องงานกีฬาสีที่ทุกคนเล่นผิดกติกา"
  },
  {
    "id": "vid-vt-hololive-voice-02",
    "youtube_id": "OasFKQl0ZPc",
    "title": "เสียงใหม่: เอ๋ แฟนเธอเข้มงวดจัง…",
    "japanese_title": "【新ボイス】えー、彼女さんきびしー…",
    "channel": "hololive ホロライブ - VTuber Group",
    "category": "VTuber",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 26,
      "N3": 10,
      "N2": 4,
      "N1": 19
    },
    "duration": 250,
    "thumbnail_gradient": "from-fuchsia-950 via-purple-950 to-slate-900",
    "scene_emoji": "💬",
    "description": "ตัวอย่างบทเสียงชุดใหม่ของเมมเบอร์โฮโลไลฟ์"
  },
  {
    "id": "vid-gaps-teppei-podcast-1",
    "youtube_id": "8Rr72XP9z6s",
    "title": "พอดแคสต์ญี่ปุ่นสำหรับผู้เริ่มต้น ตอนที่ 303 “ตดเยอะเกินไปจริงๆ!”",
    "japanese_title": "Nihongo con Teppei 波! #303「とにかくオナラが多すぎる〜！」",
    "channel": "Teppei",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 15,
      "N3": 22,
      "N2": 4,
      "N1": 24
    },
    "duration": 780,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "พอดแคสต์ภาษาญี่ปุ่นของ Teppei ตอนที่ 303 พูดถึงเรื่องตดที่มากเกินไป"
  },
  {
    "id": "vid-gaps-teppei-podcast-2",
    "youtube_id": "3z_NgINAyak",
    "title": "พอดแคสต์ญี่ปุ่นสำหรับผู้เริ่มต้น ตอนที่ 1616 “นอนหลับสบายจริงๆ!”",
    "japanese_title": "Japanese podcast for beginners (Nihongo con Teppei)#1616「よく寝た、よく寝た、よく寝たぁ〜！」",
    "channel": "Teppei",
    "category": "Podcasts",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 57,
      "N4": 17,
      "N3": 14,
      "N2": 1,
      "N1": 11
    },
    "duration": 300,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "พอดแคสต์ภาษาญี่ปุ่นสำหรับผู้เริ่มต้น ตอนที่ 1616 ของ Teppei เกี่ยวกับการนอนหลับ"
  },
  {
    "id": "vid-gaps-teppei-podcast-3",
    "youtube_id": "o6Rle7XyioQ",
    "title": "Nihongo con Teppei 波! ตอนที่ 302 “จมหายไปเลย!”",
    "japanese_title": "Nihongo con Teppei 波! #302「う、埋もれてしまう〜！」",
    "channel": "Teppei",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 41,
      "N4": 18,
      "N3": 20,
      "N2": 4,
      "N1": 17
    },
    "duration": 1105,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🎙️",
    "description": "รายการ Nihongo con Teppei ตอนที่ 302 ในชื่อ 波! ตามชื่อตอนที่บอกไว้"
  },
  {
    "id": "vid-gaps-teppei-podcast-4",
    "youtube_id": "I9QtrbzmlKY",
    "title": "พอดแคสต์ญี่ปุ่นสำหรับผู้เริ่มต้น ตอนที่ 1615 “ซีรีส์หนัง ⑤”",
    "japanese_title": "Japanese podcast for beginners (Nihongo con Teppei)#1615「映画シリーズ⑤」",
    "channel": "Teppei",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 9,
      "N3": 12,
      "N2": 2,
      "N1": 31
    },
    "duration": 485,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🎙️",
    "description": "พอดแคสต์ภาษาญี่ปุ่นสำหรับผู้เริ่มต้น ตอนที่ 1615 ว่าด้วยซีรีส์ภาพยนตร์"
  },
  {
    "id": "vid-gaps-sayuri-travel-1",
    "youtube_id": "lz_crpAbg2c",
    "title": "ไปฮิตะมาแล้ว (Sayuri Saying #338)",
    "japanese_title": "338. Hita, Kyushu: A Cozy Town Where You Lose Track of Time | 日田に行ってきました",
    "channel": "Sayuri Saying",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 12,
      "N3": 20,
      "N2": 3,
      "N1": 19
    },
    "duration": 686,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🚆",
    "description": "คลิปพูดคุยภาษาญี่ปุ่นของ Sayuri เล่าการไปเมืองฮิตะ คิวชู"
  },
  {
    "id": "vid-gaps-sayuri-talk-2",
    "youtube_id": "i425yVyFDDI",
    "title": "อยากเป็นคนแบบไหนตอนอายุ 60? (Sayuri Saying #337)",
    "japanese_title": "337.【会話】Kanreki : What Do You Want to Be Like at 60? A Chat with Shun | どんな60歳になりたい？",
    "channel": "Sayuri Saying",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 31,
      "N3": 12,
      "N2": 3,
      "N1": 15
    },
    "duration": 751,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "💬",
    "description": "บทสนทนาภาษาญี่ปุ่นของ Sayuri กับ Shun ว่าด้วยการอยากเป็นคนแบบไหนตอนอายุ 60"
  },
  {
    "id": "vid-gaps-sayuri-talk-3",
    "youtube_id": "h6kFsy7W-bs",
    "title": "คนญี่ปุ่นคุยเรื่องการเมืองกันไหม? (Sayuri Saying #321)",
    "japanese_title": "Do Japanese People Talk About Politics? An Honest Conversation w/@moshimoshi.yusuke　#321",
    "channel": "Sayuri Saying",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 22,
      "N3": 17,
      "N2": 3,
      "N1": 23
    },
    "duration": 486,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🗳️",
    "description": "บทสนทนาภาษาญี่ปุ่นของ Sayuri ว่าด้วยการพูดคุยเรื่องการเมืองของคนญี่ปุ่น"
  },
  {
    "id": "vid-gaps-sayuri-talk-4",
    "youtube_id": "M-ghprnzDBw",
    "title": "เคยหมดไฟบ้างไหม? (Sayuri Saying #336)",
    "japanese_title": "336.【会話】Do You Ever Burn Out? f/w Japanese with Shun | 燃え尽きたことある？",
    "channel": "Sayuri Saying",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 28,
      "N3": 12,
      "N2": 4,
      "N1": 19
    },
    "duration": 636,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🔥",
    "description": "บทสนทนาภาษาญี่ปุ่นของ Sayuri กับ Shun ว่าด้วยการหมดไฟ"
  },
  {
    "id": "vid-gaps-yuki-shopping-1",
    "youtube_id": "uZPjnZVD3Fo",
    "title": "ฝึกภาษาญี่ปุ่น: ประโยคใช้ซื้อของ 7 สถานการณ์",
    "japanese_title": "日本語練習／買い物で使える日本語／こんな時、何て言う？7つの場面を練習しましょう",
    "channel": "Let's speak Japanese with Yuki ",
    "category": "Daily Conversation",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 59,
      "N4": 13,
      "N3": 9,
      "N2": 0,
      "N1": 19
    },
    "duration": 635,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🛍️",
    "description": "คลิปฝึกภาษาญี่ปุ่นเรื่องประโยคที่ใช้ตอนซื้อของ แยกเป็น 7 สถานการณ์"
  },
  {
    "id": "vid-gaps-konnichi-shopping-1",
    "youtube_id": "nR_UuLKFXMc",
    "title": "ภาษาญี่ปุ่นในชีวิตประจำวัน: ซื้อของที่คอนวีเนียนสโตร์และซูเปอร์มาร์เก็ต",
    "japanese_title": "【日本生活】コンビニやスーパーでのお買い物日本語！",
    "channel": "Konnichi What's Up",
    "category": "Daily Conversation",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 43,
      "N4": 14,
      "N3": 20,
      "N2": 2,
      "N1": 21
    },
    "duration": 201,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🏪",
    "description": "คลิปภาษาญี่ปุ่นเรื่องการซื้อของที่คอนวีเนียนสโตร์และซูเปอร์มาร์เก็ต"
  },
  {
    "id": "vid-gaps-masami-restaurant-1",
    "youtube_id": "DNtLKpLZgZE",
    "title": "สนทนาภาษาญี่ปุ่น: ดูเมนูและสั่งอาหารกับเครื่องดื่ม",
    "japanese_title": "日本語会話　レストランでメニューを見て注文しましょう！　Japanese Conversation Lets read a menu and order food and drinks.",
    "channel": "MASAMI先生の日本語教室",
    "category": "Daily Conversation",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 31,
      "N4": 11,
      "N3": 24,
      "N2": 4,
      "N1": 30
    },
    "duration": 707,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "📋",
    "description": "บทสนทนาภาษาญี่ปุ่นว่าด้วยการดูเมนูและสั่งอาหารกับเครื่องดื่ม"
  },
  {
    "id": "vid-gaps-sayaka-izakaya-1",
    "youtube_id": "WXbhfbd-n6g",
    "title": "บทสนทนาในอิซากายะ: วลีที่ควรรู้และมารยาท",
    "japanese_title": "Japanese Izakaya Conversations 🏮 Must-Know Phrases & Etiquette Tips",
    "channel": "NihongoDekita with Sayaka",
    "category": "Daily Conversation",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 12,
      "N3": 15,
      "N2": 3,
      "N1": 26
    },
    "duration": 969,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🏮",
    "description": "คลิปเรื่องวลีที่ควรรู้และมารยาทเวลาไปอิซากายะ"
  },
  {
    "id": "vid-gaps-yeonjoung-cook-1",
    "youtube_id": "-lk4kDcLUUY",
    "title": "วิธีทำยุกแจจัง (ซุปเนื้อเกาหลี) ใน 10 นาที",
    "japanese_title": "１０分で出来る！簡単本格！本場韓国ユッケジャンの作り方｜具たくさんのグッパに最高なユッケジャンスープ レシピ｜ユッケジャン 作り方｜韓国語字幕",
    "channel": "yeonjoung'Kitchen How to make Korean food / Korean food recipe",
    "category": "Street Food",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 38,
      "N4": 12,
      "N3": 20,
      "N2": 2,
      "N1": 28
    },
    "duration": 522,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🍲",
    "description": "คลิปทำอาหารเกาหลีที่พูดภาษาญี่ปุ่นและมีซับเกาหลี สอนวิธีทำยุกแจจัง"
  },
  {
    "id": "vid-gaps-yeonjoung-cook-2",
    "youtube_id": "wy3V6y_U_Xw",
    "title": "วิธีทำตงชิมิ (กิมจิน้ำหัวไชเท้า) สูตรง่ายฤดูร้อน",
    "japanese_title": "🥰ドンチミ（大根水キムチ）作り方｜韓国代表水キムチのドンチミを夏バージョン（冬にも美味しい！）の簡単レシピで～｜大根水キムチ レシピ｜トンチミ 作り方",
    "channel": "yeonjoung'Kitchen How to make Korean food / Korean food recipe",
    "category": "Street Food",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 12,
      "N3": 14,
      "N2": 5,
      "N1": 23
    },
    "duration": 1015,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🥒",
    "description": "คลิปทำอาหารเกาหลีที่พูดภาษาญี่ปุ่น สอนวิธีทำตงชิมิแบบง่าย"
  },
  {
    "id": "vid-gaps-ephemeral-travel-1",
    "youtube_id": "3b1jJzxLM3c",
    "title": "เดินเที่ยวคามาคุระ: ผู้ชายอายุ 42 อยู่คนเดียว ค่าเช่าโตเกียว 35,000 เยน",
    "japanese_title": "【孤独な42歳】東京23区 家賃3.5万 徒歩で巡る鎌倉観光",
    "channel": "EphemeralStory of Solitude",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 15,
      "N3": 16,
      "N2": 5,
      "N1": 25
    },
    "duration": 903,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "🗼",
    "description": "วล็อกภาษาญี่ปุ่นเล่าการเดินเที่ยวคามาคุระและค่าเช่าที่โตเกียว"
  },
  {
    "id": "vid-gaps-cityboy-travel-1",
    "youtube_id": "hX2Mt6Xo3CA",
    "title": "ท่องชนบทญี่ปุ่นกับการนอนรถในวันฝน",
    "japanese_title": "日本の田舎を旅する雨の車中泊",
    "channel": "CITY BOY",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 12,
      "N3": 18,
      "N2": 5,
      "N1": 19
    },
    "duration": 1111,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🚐",
    "description": "วล็อกภาษาญี่ปุ่นเล่าการเดินทางในชนบทและการนอนในรถวันฝน"
  },
  {
    "id": "vid-gaps-helska-vlog-1",
    "youtube_id": "tYN746sTXUw",
    "title": "มาถึงญี่ปุ่นแล้ว",
    "japanese_title": "日本に来ました",
    "channel": "ヘルスカ",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 16,
      "N3": 15,
      "N2": 6,
      "N1": 21
    },
    "duration": 514,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🇯🇵",
    "description": "วล็อกภาษาญี่ปุ่นเรื่องการมาถึงญี่ปุ่น"
  },
  {
    "id": "vid-gaps-bonbon-ikkyu-1",
    "youtube_id": "CfMVMGI1HeI",
    "title": "อิคคิวซัง (ฉบับภาษาญี่ปุ่น) นิทานพื้นบ้านญี่ปุ่น",
    "japanese_title": "一休さん - いっきゅうさん（日本語版）アニメ日本の昔ばなし／日本語学習／THE YOUNG MONK IKKYU (JAPANESE)",
    "channel": "ボンボンアカデミー",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 36,
      "N4": 13,
      "N3": 21,
      "N2": 5,
      "N1": 25
    },
    "duration": 547,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "🎋",
    "description": "อนิเมะนิทานพื้นบ้านญี่ปุ่นเรื่องอิคคิวซัง พูดภาษาญี่ปุ่น"
  },
  {
    "id": "vid-gaps-bonbon-momotaro-1",
    "youtube_id": "3k75rkB61Bk",
    "title": "โมโมทาโร่ (ฉบับภาษาญี่ปุ่น) นิทานพื้นบ้านญี่ปุ่น",
    "japanese_title": "桃太郎 -ももたろう（日本語版）アニメ日本の昔ばなし／日本語学習／PEACH BOY - MOMOTARO (JAPANESE)",
    "channel": "ボンボンアカデミー",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 17,
      "N3": 15,
      "N2": 5,
      "N1": 24
    },
    "duration": 552,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🍑",
    "description": "อนิเมะนิทานพื้นบ้านญี่ปุ่นเรื่องโมโมทาโร่ พูดภาษาญี่ปุ่น"
  },
  {
    "id": "vid-gaps-yumeaaru-folk-1",
    "youtube_id": "Vsw8C2hlT_k",
    "title": "รวมนิทานพื้นบ้านญี่ปุ่นสนุกๆ 6 เรื่อง (17 นาที)",
    "japanese_title": "おもしろ日本昔話集【全6話 17分】",
    "channel": "ゆめあるチャンネル",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 35,
      "N4": 12,
      "N3": 18,
      "N2": 3,
      "N1": 32
    },
    "duration": 1050,
    "thumbnail_gradient": "from-indigo-950 via-violet-950 to-slate-900",
    "scene_emoji": "📖",
    "description": "รวมนิทานพื้นบ้านญี่ปุ่นหลายเรื่องในคลิปเดียว ความยาวประมาณ 17 นาที"
  },
  {
    "id": "vid-gaps-manga-mukashi-1",
    "youtube_id": "xfGR6kbv4Es",
    "title": "โอมุสุบิโคโรริน (มีภาษามือ) จากการ์ตูนนิทานญี่ปุ่นเก่า",
    "japanese_title": "【まんが日本昔ばなし】手話つき『おむすびころりん』",
    "channel": "【公式】まんが日本昔ばなし",
    "category": "Podcasts",
    "difficulty_rating": 4,
    "primary_jlpt": "N2",
    "jlpt_distribution": {
      "N5": 37,
      "N4": 11,
      "N3": 13,
      "N2": 4,
      "N1": 35
    },
    "duration": 643,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-neutral-900",
    "scene_emoji": "🤟",
    "description": "การ์ตูนนิทานพื้นบ้านญี่ปุ่นเรื่องโอมุสุบิโคโรริน มีภาษามือประกอบ"
  },
  {
    "id": "vid-gaps-yuyu-podcast-1",
    "youtube_id": "C9VabhxOPbA",
    "title": "คำแนะนำการสนทนา: ค่อยๆ เก่งขึ้น (พอดแคสต์ฝึกฟังภาษาญี่ปุ่น)",
    "japanese_title": "会話のアドバイス/Get better slowly (Japanese Podcast for Listening Practice)",
    "channel": "YUYUの日本語Podcast",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 21,
      "N3": 13,
      "N2": 1,
      "N1": 19
    },
    "duration": 1033,
    "thumbnail_gradient": "from-sky-950 via-cyan-950 to-slate-900",
    "scene_emoji": "🎧",
    "description": "พอดแคสต์ฝึกฟังภาษาญี่ปุ่นว่าด้วยคำแนะนำเรื่องการสนทนา"
  },
  {
    "id": "vid-gaps-bitesize-routine-1",
    "youtube_id": "_JM8kVLWDLA",
    "title": "เรื่องกิจวัตรตอนเช้า: ฝึกฟังภาษาญี่ปุ่นระดับกลาง",
    "japanese_title": "朝のルーティーンについて- Japanese Listening Practice【中級】",
    "channel": "Bite Size Japanese",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 17,
      "N3": 11,
      "N2": 6,
      "N1": 22
    },
    "duration": 1199,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-zinc-900",
    "scene_emoji": "☀️",
    "description": "คลิปฝึกฟังภาษาญี่ปุ่นระดับกลางว่าด้วยกิจวัตรตอนเช้า"
  },
  {
    "id": "vid-gaps-bitesize-thinking-1",
    "youtube_id": "PGp4f-cvDSE",
    "title": "คิดเป็นภาษาอะไร? การคิดเป็นภาษาญี่ปุ่น ตอนที่ 734",
    "japanese_title": "何語で考えてる？日本語で考えるとは？ Japanese Listening Practice N3・N2レベル【中級】Ep.734",
    "channel": "Bite Size Japanese",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 53,
      "N4": 16,
      "N3": 13,
      "N2": 3,
      "N1": 15
    },
    "duration": 1115,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🧠",
    "description": "คลิปฝึกฟังภาษาญี่ปุ่นระดับ N3-N2 ว่าด้วยการคิดเป็นภาษาญี่ปุ่น"
  },
  {
    "id": "vid-real-akane-travel-1",
    "youtube_id": "7Algbn8JVXc",
    "title": "เดินเล่นแนะนำ 5 ที่เที่ยวญี่ปุ่นน่าไป (Sanpo Vlog #15)",
    "japanese_title": "【さんぽvlog ♯15】日本のおすすめの観光地を５つ紹介します",
    "channel": "あかね的日本語教室",
    "category": "Vlogs",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 52,
      "N4": 16,
      "N3": 13,
      "N2": 2,
      "N1": 17
    },
    "duration": 883,
    "thumbnail_gradient": "from-emerald-950 via-teal-950 to-slate-900",
    "scene_emoji": "🗾",
    "description": "ครูอาคาเนะเดินเล่นเล่าแนะนำ 5 สถานที่ท่องเที่ยวในญี่ปุ่นพร้อมซับญี่ปุ่นและไทย"
  },
  {
    "id": "vid-real-akane-habit-1",
    "youtube_id": "QdugborrFlo",
    "title": "เดินเล่นคุยเรื่องการฝึกนิสัยให้ทำได้ต่อเนื่อง (Sanpo Vlog #14)",
    "japanese_title": "【JapaneseさんぽVlog ♯14】続けるのが苦手な人に知ってほしいこと",
    "channel": "あかね的日本語教室",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 48,
      "N4": 24,
      "N3": 11,
      "N2": 3,
      "N1": 14
    },
    "duration": 854,
    "thumbnail_gradient": "from-sky-950 via-blue-950 to-slate-900",
    "scene_emoji": "🚶",
    "description": "ครูอาคาเนะเดินเล่นแชร์เคล็ดลับสำหรับคนที่ทำอะไรไม่ค่อยต่อเนื่อง"
  },
  {
    "id": "vid-real-akane-books-1",
    "youtube_id": "xkPYLEZTfSA",
    "title": "คำศัพท์และบทสนทนาภาษาญี่ปุ่นเกี่ยวกับหนังสือและการอ่าน",
    "japanese_title": "【日本語単語】本に関する日本語の言葉",
    "channel": "あかね的日本語教室",
    "category": "Daily Conversation",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 59,
      "N4": 13,
      "N3": 11,
      "N2": 3,
      "N1": 14
    },
    "duration": 717,
    "thumbnail_gradient": "from-amber-950 via-orange-950 to-slate-900",
    "scene_emoji": "📚",
    "description": "เรียนรู้คำศัพท์และสำนวนที่คนญี่ปุ่นใช้จริงเวลาพูดถึงหนังสือและการอ่าน"
  },
  {
    "id": "vid-real-sayuri-nomi-1",
    "youtube_id": "l0NnzxbjIug",
    "title": "วัฒนธรรมการดื่มของคนญี่ปุ่น: บุเรโค ชิราฟุ และโนมินิเคชั่น",
    "japanese_title": "Bureiko, Shirafu, and Nominication: How Japan Bonds Over Drinks #326",
    "channel": "Sayuri Saying",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 44,
      "N4": 14,
      "N3": 21,
      "N2": 2,
      "N1": 19
    },
    "duration": 756,
    "thumbnail_gradient": "from-rose-950 via-red-950 to-slate-900",
    "scene_emoji": "🍶",
    "description": "พอดแคสต์ Sayuri Saying เล่าเรื่องวัฒนธรรมการสังสรรค์และคำศัพท์วงเหล้าญี่ปุ่น"
  },
  {
    "id": "vid-real-sayuri-couple-1",
    "youtube_id": "VvVOC4ACfuY",
    "title": "บทสนทนา: คู่สามีภรรยาญี่ปุ่นจัดการเรื่องเงินในบ้านกันยังไง?",
    "japanese_title": "【会話】How Do Japanese Couples Actually Manage Their Money? | 夫婦のお財布事情 #330",
    "channel": "Sayuri Saying",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 22,
      "N3": 14,
      "N2": 3,
      "N1": 19
    },
    "duration": 599,
    "thumbnail_gradient": "from-indigo-950 via-purple-950 to-slate-900",
    "scene_emoji": "💴",
    "description": "บทสนทนาจริงกับคู่รักชาวญี่ปุ่นเรื่องการบริหารค่าใช้จ่ายในครอบครัว"
  },
  {
    "id": "vid-real-miku-hurt-1",
    "youtube_id": "FerhHlgUn7U",
    "title": "ว่าด้วยเรื่องความรู้สึกเจ็บปวดใจ (ฝึกฟังระดับ N3-N2)",
    "japanese_title": "傷つくことについて Japanese Listening Practice N3・N2 level",
    "channel": "Miku Real Japanese",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 46,
      "N4": 19,
      "N3": 12,
      "N2": 1,
      "N1": 22
    },
    "duration": 889,
    "thumbnail_gradient": "from-slate-900 via-indigo-950 to-zinc-900",
    "scene_emoji": "💭",
    "description": "Miku เล่ามุมมองเรื่องความรู้สึกเจ็บปวดและการรับมือด้วยภาษาญี่ปุ่นธรรมชาติ"
  },
  {
    "id": "vid-real-miku-shrine-1",
    "youtube_id": "ijh0hq5k2hs",
    "title": "บทเรียนชีวิตแบบญี่ปุ่นที่ซ่อนอยู่ในศาลเจ้าทุกแห่ง",
    "japanese_title": "The Japanese Life Lesson Hidden in Every Shrine Japanese Listening Practice N3・N2 level",
    "channel": "Miku Real Japanese",
    "category": "Podcasts",
    "difficulty_rating": 3,
    "primary_jlpt": "N3",
    "jlpt_distribution": {
      "N5": 39,
      "N4": 19,
      "N3": 18,
      "N2": 3,
      "N1": 21
    },
    "duration": 551,
    "thumbnail_gradient": "from-red-950 via-rose-950 to-slate-900",
    "scene_emoji": "⛩️",
    "description": "Miku แชร์ข้อคิดและวัฒนธรรมญี่ปุ่นผ่านเรื่องราวของศาลเจ้า"
  },
  {
    "id": "vid-real-sayaka-matcha-1",
    "youtube_id": "UceTlQ4tNck",
    "title": "ฝึกภาษาญี่ปุ่นจริงในโตเกียว: สั่งเมนูและคุยที่ร้านคาเฟ่มัทฉะ",
    "japanese_title": "東京でリアル日本語🇯🇵 抹茶カフェで注文＆会話🍵日本語聴解",
    "channel": "NihongoDekita with Sayaka",
    "category": "Daily Conversation",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 42,
      "N4": 19,
      "N3": 12,
      "N2": 3,
      "N1": 24
    },
    "duration": 686,
    "thumbnail_gradient": "from-emerald-950 via-green-950 to-slate-900",
    "scene_emoji": "🍵",
    "description": "ซายากะพาไปสั่งมัทฉะและสนทนาจริงกับพนักงานที่คาเฟ่ในโตเกียว"
  },
  {
    "id": "vid-real-nihongolearn-red-1",
    "youtube_id": "zcZIkpMBs14",
    "title": "รู้จักของสีแดงที่เป็นเอกลักษณ์ของญี่ปุ่น (N5 ฟังง่าย)",
    "japanese_title": "Discover Japan's Iconic Red Objects! - Comprehensible Japanese",
    "channel": "Nihongo-Learning",
    "category": "Daily Conversation",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 60,
      "N4": 8,
      "N3": 11,
      "N2": 2,
      "N1": 19
    },
    "duration": 280,
    "thumbnail_gradient": "from-red-950 via-rose-950 to-slate-900",
    "scene_emoji": "🔴",
    "description": "เรียนรู้คำศัพท์และวัฒนธรรมญี่ปุ่นผ่านสิ่งของสีแดงที่เป็นเอกลักษณ์ของญี่ปุ่นด้วยภาษาฟังง่าย"
  },
  {
    "id": "vid-real-nihongolearn-chat-1",
    "youtube_id": "ooQNETO4dK0",
    "title": "อัปสกิลการคุยภาษาญี่ปุ่นแบบเป็นกันเอง พูดตามไปพร้อมกัน",
    "japanese_title": "Level Up Your Japanese Chat Skills! - Comprehensible Japanese",
    "channel": "Nihongo-Learning",
    "category": "Daily Conversation",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 53,
      "N4": 20,
      "N3": 8,
      "N2": 3,
      "N1": 16
    },
    "duration": 587,
    "thumbnail_gradient": "from-violet-950 via-purple-950 to-slate-900",
    "scene_emoji": "💬",
    "description": "ฝึกโต้ตอบบทสนทนาภาษาญี่ปุ่นในชีวิตประจำวันแบบเป็นธรรมชาติ"
  },
  {
    "id": "vid-real-nihongolearn-etiquette-1",
    "youtube_id": "aczPsLhpDRE",
    "title": "มารยาทและวิถีชีวิตพื้นฐาน 3 ข้อที่ควรรู้ในญี่ปุ่น",
    "japanese_title": "3 Essential Japanese Etiquette Tips!  - Comprehensible Japanese",
    "channel": "Nihongo-Learning",
    "category": "Daily Conversation",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 61,
      "N4": 15,
      "N3": 8,
      "N2": 4,
      "N1": 12
    },
    "duration": 243,
    "thumbnail_gradient": "from-pink-950 via-rose-950 to-slate-900",
    "scene_emoji": "🙇",
    "description": "เรียนรู้มารยาทและธรรมเนียมพื้นฐาน 3 ข้อของคนญี่ปุ่นด้วยภาษาเข้าใจง่าย"
  },
  {
    "id": "vid-real-kensan-rain-1",
    "youtube_id": "NkQXYEiAvwM",
    "title": "เดินเล่นวันฝนตกในญี่ปุ่น: ฝึกฟังภาษาญี่ปุ่นเข้าใจง่าย (N4)",
    "japanese_title": "A rainy day walk in Japan 🇯🇵 | Easy Japanese listening | N4",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 66,
      "N4": 15,
      "N3": 9,
      "N2": 2,
      "N1": 8
    },
    "duration": 735,
    "thumbnail_gradient": "from-blue-950 via-slate-900 to-zinc-900",
    "scene_emoji": "☔",
    "description": "เคนซังพาเดินเล่นในญี่ปุ่นวันฝนตกพร้อมเล่าเรื่องด้วยภาษาญี่ปุ่นฟังง่ายระดับ N4"
  },
  {
    "id": "vid-real-kensan-goat-1",
    "youtube_id": "lZifLIXWOPU",
    "title": "วันหยุดฤดูร้อนในญี่ปุ่นกับน้องแพะ: ฝึกฟังภาษาญี่ปุ่น (N4)",
    "japanese_title": "A Summer Weekend in Japan 🐐 | Easy Japanese Listening | N4",
    "channel": "けんさんおかえり Japanese",
    "category": "Podcasts",
    "difficulty_rating": 2,
    "primary_jlpt": "N4",
    "jlpt_distribution": {
      "N5": 58,
      "N4": 13,
      "N3": 12,
      "N2": 3,
      "N1": 14
    },
    "duration": 690,
    "thumbnail_gradient": "from-lime-950 via-emerald-950 to-slate-900",
    "scene_emoji": "🐐",
    "description": "เคนซังเล่าเรื่องเที่ยววันหยุดฤดูร้อนและไปเจอน้องแพะด้วยภาษาญี่ปุ่นระดับ N4"
  },
  {
    "id": "vid-real-akiko-souvenir-1",
    "youtube_id": "YdcvPdXxzik",
    "title": "ฝึกฟังภาษาญี่ปุ่น N5: ของฝากญี่ปุ่นและรองเท้า Onitsuka Tiger",
    "japanese_title": "JLPT N5 Listening Practice 🇯🇵 Japan Souvenirs | Onitsukatiger, snacks, skincare ! 💖",
    "channel": "Akiko_Japanese_Conversations",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 54,
      "N4": 9,
      "N3": 20,
      "N2": 1,
      "N1": 16
    },
    "duration": 555,
    "thumbnail_gradient": "from-amber-950 via-yellow-950 to-slate-900",
    "scene_emoji": "👟",
    "description": "อากิโกะเล่าเรื่องของฝากยอดฮิตจากญี่ปุ่นด้วยภาษาญี่ปุ่นระดับ N5"
  },
  {
    "id": "vid-real-akiko-ryokan-1",
    "youtube_id": "E0Dn4rITMRs",
    "title": "ฝึกฟังภาษาญี่ปุ่น N5: เที่ยวญี่ปุ่นและพักเรียวกังออนเซ็น",
    "japanese_title": "JLPT N5 Listening Practice🇯🇵 Japan Trip : I stayed at a Spirited Away Ryokan",
    "channel": "Akiko_Japanese_Conversations",
    "category": "Vlogs",
    "difficulty_rating": 1,
    "primary_jlpt": "N5",
    "jlpt_distribution": {
      "N5": 49,
      "N4": 11,
      "N3": 17,
      "N2": 7,
      "N1": 16
    },
    "duration": 664,
    "thumbnail_gradient": "from-orange-950 via-red-950 to-slate-900",
    "scene_emoji": "♨️",
    "description": "อากิโกะเล่าประสบการณ์เที่ยวญี่ปุ่นและเข้าพักเรียวกังออนเซ็นระดับ N5"
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
