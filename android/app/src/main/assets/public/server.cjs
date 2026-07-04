var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data.ts
var DICTIONARY = [
  {
    id: "dict-khamzang",
    word: "Khamzang",
    tibetanScript: "\u0F41\u0F58\u0F66\u0F0B\u0F56\u0F5F\u0F44\u0F0B\u0F0D",
    persoArabicScript: "\u062E\u0645\u0632\u0646\u06AF",
    ipa: "/k\u02B0am.za\u014B/",
    meaning: "Greetings, well-being, safe and sound, peaceful",
    urduMeaning: "\u0633\u0644\u0627\u0645\u060C \u0633\u0644\u0627\u0645\u062A\u06CC\u060C \u062E\u06CC\u0631\u06CC\u062A",
    partOfSpeech: "Noun / Interjection",
    dialect: "common",
    definition: "An ancient greeting term shared across Balti, Purigi, and Ladakhi. Translates to 'in good health/elements'. Used to wish peace or check someone's condition.",
    exampleSentence: "Khamzang yod-a, Aba?",
    exampleTranslation: "Are you well, Father?",
    etymology: "From Old Tibetan 'khams' (physical health) + 'bzang' (fine/virtuous)."
  },
  {
    id: "dict-joo",
    word: "Joo",
    tibetanScript: "\u0F47\u0F74\u0F0D",
    persoArabicScript: "\u062C\u0648",
    ipa: "/d\u0292u\u02D0/",
    meaning: "Multi-purpose particle: Hello, Thank you, Goodbye",
    urduMeaning: "\u0634\u06A9\u0631\u06CC\u06C1\u060C \u0633\u0644\u0627\u0645\u060C \u0627\u0644\u0648\u062F\u0627\u0639",
    partOfSpeech: "Interjection",
    dialect: "common",
    definition: "An honorary conversational particle that signifies respect, appreciation, or leave-taking. Highly typical of Himalayan Baltistan and Ladakh language regions.",
    exampleSentence: "Joo joo, nga-i butsa.",
    exampleTranslation: "Thank you, my son.",
    etymology: "A regional honorific morpheme, linked to classic Central Asian respectful responses."
  },
  {
    id: "dict-aba",
    word: "Aba",
    tibetanScript: "\u0F68\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0627\u0628\u0627",
    ipa: "/a.ba/",
    meaning: "Father",
    urduMeaning: "\u0648\u0627\u0644\u062F / \u0627\u0628\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Primary family word referring to father. In honorific speech, sometimes suffixed as 'Aba-le'.",
    exampleSentence: "Aba-is khambir zos.",
    exampleTranslation: "Father ate the traditional bread.",
    etymology: "Proto-Tibeto-Burman kinship vocalization."
  },
  {
    id: "dict-ama",
    word: "Ama",
    tibetanScript: "\u0F68\u0F0B\u0F58\u0F0D",
    persoArabicScript: "\u0627\u0645\u0651\u0627",
    ipa: "/a.ma/",
    meaning: "Mother",
    urduMeaning: "\u0648\u0627\u0644\u062F\u06C1 / \u0627\u0645\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Kinship term for mother, widely used across Kargil, Leh, and Baltistan valleys. Suffix '-le' makes it honorific ('Ama-le').",
    exampleSentence: "Ama-la tsha cha chin.",
    exampleTranslation: "Give salt to Mother.",
    etymology: "Old Tibetan 'ma'."
  },
  {
    id: "dict-ape",
    word: "Ape",
    tibetanScript: "\u0F68\u0F0B\u0F55\u0FB1\u0F72\u0F0D",
    persoArabicScript: "\u0627\u067E\u06D2",
    ipa: "/a.pe/",
    meaning: "Grandfather",
    urduMeaning: "\u062F\u0627\u062F\u0627 / \u0646\u0627\u0646\u0627",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Purki kinship term for grandfather. Also used respectfully for elderly male community members in Kargil.",
    exampleSentence: "Ape-is khurba zos.",
    exampleTranslation: "Grandfather ate the bread.",
    etymology: "Related to Classical Tibetan 'a-phyi' (grandmother/elder)."
  },
  {
    id: "dict-momo",
    word: "Momo",
    tibetanScript: "\u0F58\u0F7C\u0F0B\u0F58\u0F7C\u0F0D",
    persoArabicScript: "\u0645\u0648\u0645\u0648",
    ipa: "/mo.mo/",
    meaning: "Grandmother",
    urduMeaning: "\u062F\u0627\u062F\u06CC / \u0646\u0627\u0646\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Affectionate maternal and paternal kinship term for grandmother.",
    exampleSentence: "Momo-la khamzang thuk.",
    exampleTranslation: "Greetings to Grandmother.",
    etymology: "Himalayan Tibetan honorific nursery word."
  },
  {
    id: "dict-butsa",
    word: "Butsa",
    tibetanScript: "\u0F56\u0F74\u0F0B\u0F5A\u0F0D",
    persoArabicScript: "\u0628\u0686\u0627",
    ipa: "/bu.tsa/",
    meaning: "Boy / Son",
    urduMeaning: "\u0644\u0691\u06A9\u0627 / \u0628\u06CC\u0679\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Refers to a young male child or a biological son.",
    exampleSentence: "Nga-la butsa chik yod.",
    exampleTranslation: "I have one son.",
    etymology: "From Classical Tibetan 'bu' (boy/son) + 'tsha' (grandchild/descendant)."
  },
  {
    id: "dict-bumo",
    word: "Bumo",
    tibetanScript: "\u0F56\u0F74\u0F0B\u0F58\u0F7C\u0F0D",
    persoArabicScript: "\u0628\u0648\u0645\u0648",
    ipa: "/bu.mo/",
    meaning: "Girl / Daughter",
    urduMeaning: "\u0644\u0691\u06A9\u06CC / \u0628\u06CC\u0679\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Refers to a young female child or biological daughter.",
    exampleSentence: "Khyang-la bumo sum yod-a?",
    exampleTranslation: "Do you have three daughters?",
    etymology: "Classical Tibetan 'bu-mo' (daughter)."
  },
  {
    id: "dict-nao",
    word: "Nao",
    tibetanScript: "\u0F53\u0F74\u0F0B\u0F56\u0F7C\u0F0D",
    persoArabicScript: "\u0646\u0627\u0648",
    ipa: "/na.o/",
    meaning: "Younger Brother",
    urduMeaning: "\u0686\u06BE\u0648\u0679\u0627 \u0628\u06BE\u0627\u0626\u06CC",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Refers to a younger male sibling in Purgi households.",
    exampleSentence: "Nga-i nao skul-la song.",
    exampleTranslation: "My younger brother went to school.",
    etymology: "Classical Tibetan 'nu-bo'."
  },
  {
    id: "dict-nama",
    word: "Nama",
    tibetanScript: "\u0F58\u0F53\u0F60\u0F0B\u0F58\u0F0D",
    persoArabicScript: "\u0646\u0627\u0645\u0627",
    ipa: "/na.ma/",
    meaning: "Bride / Daughter-in-law",
    urduMeaning: "\u062F\u0644\u06C1\u0646 / \u0628\u06C1\u0648",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Kinship term for daughter-in-law or newly wed bride.",
    exampleSentence: "Nama nang-la ongis.",
    exampleTranslation: "The bride has entered the house.",
    etymology: "Old Tibetan 'mna'-ma'."
  },
  {
    id: "dict-mi",
    word: "Mi",
    tibetanScript: "\u0F58\u0F72\u0F0D",
    persoArabicScript: "\u0645\u06CC",
    ipa: "/mi/",
    meaning: "Man / Person / Human",
    urduMeaning: "\u0622\u062F\u0645\u06CC / \u0627\u0646\u0633\u0627\u0646",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A person or human being.",
    exampleSentence: "Nang-la mi nis yod.",
    exampleTranslation: "There are two people in the house.",
    etymology: "Sino-Tibetan root '*myit' / Classical Tibetan 'mi'."
  },
  {
    id: "dict-skarma",
    word: "Skarma",
    tibetanScript: "\u0F66\u0F90\u0F62\u0F0B\u0F58\u0F0D",
    persoArabicScript: "\u0633\u06A9\u0631\u0645\u06C1",
    ipa: "/skar.ma/",
    meaning: "Star",
    urduMeaning: "\u0633\u062A\u0627\u0631\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Celestial stellar object. A premier example of archaic consonant retention ('sk-') in modern Tibeto-Burman phonology.",
    exampleSentence: "Nam-la skarma mangpo yod.",
    exampleTranslation: "There are many stars in the sky.",
    etymology: "Old Tibetan 'skar-ma'. Tone-dependent in Standard Lhasa, but retains clusters in Balti and Purigi."
  },
  {
    id: "dict-lakpa",
    word: "Lakpa",
    tibetanScript: "\u0F63\u0F42\u0F0B\u0F54\u0F0D",
    persoArabicScript: "\u0644\u0642\u067E\u0627 / \u0644\u06AF\u067E\u0627",
    ipa: "/lak.pa/",
    meaning: "Hand / Arm",
    urduMeaning: "\u06C1\u0627\u062A\u06BE",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "The upper limb of the human body. Retains the ancient final 'k' voiceless glottal stop sound.",
    exampleSentence: "Khyang-gi lakpa thsokpo yo.",
    exampleTranslation: "Your hand is beautiful.",
    etymology: "Old Tibetan 'lag-pa'."
  },
  {
    id: "dict-kanga",
    word: "Kanga",
    tibetanScript: "\u0F62\u0F90\u0F44\u0F0B\u0F54\u0F0D",
    persoArabicScript: "\u06A9\u0627\u0646\u06AF\u0627",
    ipa: "/ka\u014B.ga/",
    meaning: "Foot / Leg",
    urduMeaning: "\u067E\u0627\u0624\u06BA",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Lower limb or foot. Features the archaic 'rk-' prefix preservation pronounced as k-voiceless or k-voiced cluster.",
    exampleSentence: "Kanga-la tsherma tsuks-pa.",
    exampleTranslation: "A thorn pricked my foot.",
    etymology: "Classical Tibetan 'rkang-pa'."
  },
  {
    id: "dict-go",
    word: "Go",
    tibetanScript: "\u0F58\u0F42\u0F7C\u0F0D",
    persoArabicScript: "\u06AF\u0648",
    ipa: "/go/",
    meaning: "Head",
    urduMeaning: "\u0633\u0631",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "The head of a human or animal. Derives from a prefixed classical root where the prefix voiced stop is dropped but leaves the main voiced stop.",
    exampleSentence: "Nga-i go-la thsa-gzer yod.",
    exampleTranslation: "My head hurts / I have a headache.",
    etymology: "Classical Tibetan 'mgo'."
  },
  {
    id: "dict-mik",
    word: "Mik",
    tibetanScript: "\u0F58\u0F72\u0F42\u0F0D",
    persoArabicScript: "\u0645\u06A9",
    ipa: "/mik/",
    meaning: "Eye",
    urduMeaning: "\u0622\u0646\u06A9\u06BE",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Human eye or sense of vision. Retains final -g stop pronunciation as a voiceless stop.",
    exampleSentence: "Mik nis gnyid-is zim-pa.",
    exampleTranslation: "Both eyes closed in sleep.",
    etymology: "Classical Tibetan 'mig' / 'migs'."
  },
  {
    id: "dict-hrna",
    word: "Hrna",
    tibetanScript: "\u0F66\u0FA3\u0F0D",
    persoArabicScript: "\u06C1\u0631\u0646\u0627",
    ipa: "/rna/",
    meaning: "Nose",
    urduMeaning: "\u0646\u0627\u06A9",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Nose. Retains the ancient retroflex/aspirated or voiceless nasal sound typified by the 's-' prefix in classical orthography.",
    exampleSentence: "Hrna-la thsaldum babs.",
    exampleTranslation: "Blood came from the nose.",
    etymology: "Classical Tibetan 'sna'."
  },
  {
    id: "dict-hrnachu",
    word: "Hrna-chhu",
    tibetanScript: "\u0F66\u0FA3\u0F0B\u0F46\u0F74\u0F0D",
    persoArabicScript: "\u06C1\u0631\u0646\u0627\u0686\u0648",
    ipa: "/rna.t\u0283u/",
    meaning: "Mucus / Nasal discharge",
    urduMeaning: "\u0646\u0627\u06A9 \u06A9\u0627 \u067E\u0627\u0646\u06CC",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Literal compound of 'nose' (hrna) and 'water' (chhu).",
    exampleSentence: "Hrna-chhu babs-ches re.",
    exampleTranslation: "Nasal water is running.",
    etymology: "Classical Tibetan 'sna-chu'."
  },
  {
    id: "dict-rnaba",
    word: "Rna-ba",
    tibetanScript: "\u0F62\u0FA3\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0631\u0646\u0627\u0628\u0627",
    ipa: "/rna.ba/",
    meaning: "Ear",
    urduMeaning: "\u06A9\u0627\u0646",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "The auditory organ of hearing.",
    exampleSentence: "Rna-ba-is thos-pa.",
    exampleTranslation: "The ear heard.",
    etymology: "Classical Tibetan 'rna-ba'."
  },
  {
    id: "dict-kha",
    word: "Kha",
    tibetanScript: "\u0F41\u0F0D",
    persoArabicScript: "\u06A9\u06BE\u0627",
    ipa: "/k\u02B0a/",
    meaning: "Mouth",
    urduMeaning: "\u0645\u0646\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Mouth. Used in multiple idioms such as 'kha-thak' (silent) or 'kha-zang' (honest speech).",
    exampleSentence: "Kha thong!",
    exampleTranslation: "Open your mouth!",
    etymology: "Classical Tibetan 'kha'."
  },
  {
    id: "dict-so",
    word: "So",
    tibetanScript: "\u0F66\u0F7C\u0F0D",
    persoArabicScript: "\u0633\u0648",
    ipa: "/so/",
    meaning: "Tooth",
    urduMeaning: "\u062F\u0627\u0646\u062A",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Tooth or teeth.",
    exampleSentence: "So-la thsa-gzer babs-pa.",
    exampleTranslation: "Got a toothache.",
    etymology: "Classical Tibetan 'so'."
  },
  {
    id: "dict-lche",
    word: "Lche",
    tibetanScript: "\u0F63\u0F95\u0F7A\u0F0D",
    persoArabicScript: "\u0644\u0686\u06D2",
    ipa: "/lt\u0283e/",
    meaning: "Tongue",
    urduMeaning: "\u0632\u0628\u0627\u0646",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "The muscular organ of taste and speech, keeping the archaic 'lc-' cluster intact.",
    exampleSentence: "Lche thon-ba.",
    exampleTranslation: "Stick out your tongue.",
    etymology: "Classical Tibetan 'lce'."
  },
  {
    id: "dict-spu",
    word: "Spu",
    tibetanScript: "\u0F66\u0FA4\u0F74\u0F0D",
    persoArabicScript: "\u0633\u067E\u0648",
    ipa: "/spu/",
    meaning: "Hair / Fur / Feather",
    urduMeaning: "\u0628\u0627\u0644",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Body hair or fleece, retaining the unvoiced bilabial stop with 's' cluster prefix.",
    exampleSentence: "Khuyi-i spu karpo yo.",
    exampleTranslation: "The dog's fur is white.",
    etymology: "Classical Tibetan 'spu'."
  },
  {
    id: "dict-chu",
    word: "Chu",
    tibetanScript: "\u0F46\u0F74\u0F0D",
    persoArabicScript: "\u0686\u0648",
    ipa: "/t\u0283u\u02D0/",
    meaning: "Water / Liquid",
    urduMeaning: "\u067E\u0627\u0646\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Water. Essential lexical item. Often compound forms like 'chu-mran' (water spring) or 'chu-tsan' (hot water).",
    exampleSentence: "Nga-la chu thung-chas in.",
    exampleTranslation: "I want to drink water.",
    etymology: "Proto-Tibeto-Burman '*tsyiy'."
  },
  {
    id: "dict-me",
    word: "Me",
    tibetanScript: "\u0F58\u0F7A\u0F0D",
    persoArabicScript: "\u0645\u06D2",
    ipa: "/me/",
    meaning: "Fire",
    urduMeaning: "\u0622\u06AF",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Fire or flame.",
    exampleSentence: "Me spar!",
    exampleTranslation: "Light the fire!",
    etymology: "Classical Tibetan 'me'."
  },
  {
    id: "dict-lungpo",
    word: "Lungpo",
    tibetanScript: "\u0F62\u0FB3\u0F74\u0F44\u0F0B\u0F54\u0F7C\u0F0D",
    persoArabicScript: "\u0644\u0648\u0646\u06AF\u067E\u0648",
    ipa: "/lu\u014B.po/",
    meaning: "Wind / Air current",
    urduMeaning: "\u06C1\u0648\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Strong mountain wind, keeping the ancient 'rl-' phoneme pronounced as a velar or lateral fricative.",
    exampleSentence: "Lungpo tshanmo gyap-pa.",
    exampleTranslation: "Warm wind is blowing.",
    etymology: "Classical Tibetan 'rlung-po'."
  },
  {
    id: "dict-sa",
    word: "Sa",
    tibetanScript: "\u0F66\u0F0D",
    persoArabicScript: "\u0633\u0627",
    ipa: "/sa/",
    meaning: "Earth / Soil / Land",
    urduMeaning: "\u0632\u0645\u06CC\u0646 / \u0645\u0679\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "The ground, earth, or a plot of land.",
    exampleSentence: "Sa-la duk!",
    exampleTranslation: "Sit on the ground!",
    etymology: "Classical Tibetan 'sa'."
  },
  {
    id: "dict-ri",
    word: "Ri",
    tibetanScript: "\u0F62\u0F72\u0F0D",
    persoArabicScript: "\u0631\u06CC",
    ipa: "/ri/",
    meaning: "Mountain",
    urduMeaning: "\u067E\u06C1\u0627\u0691",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A mountain or high peak, typical feature of Ladakh's landscape.",
    exampleSentence: "Kargil-gi ri-la kha-ba babs.",
    exampleTranslation: "Snow fell on the mountains of Kargil.",
    etymology: "Classical Tibetan 'ri'."
  },
  {
    id: "dict-la",
    word: "La",
    tibetanScript: "\u0F63\u0F0D",
    persoArabicScript: "\u0644\u0627",
    ipa: "/la/",
    meaning: "Mountain Pass",
    urduMeaning: "\u062F\u0631\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A high mountain pass connecting valleys (e.g. Zoji La, Fotu La).",
    exampleSentence: "La thon-ba bka-mo yo.",
    exampleTranslation: "Crossing the mountain pass is difficult.",
    etymology: "Classical Tibetan 'la'."
  },
  {
    id: "dict-khaba",
    word: "Kha-ba",
    tibetanScript: "\u0F41\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u06A9\u06BE\u0627\u0628\u0627",
    ipa: "/k\u02B0a.ba/",
    meaning: "Snow",
    urduMeaning: "\u0628\u0631\u0641",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Snow. A crucial winter lexical item in regional vocabularies.",
    exampleSentence: "Kha-ba mangpo babs.",
    exampleTranslation: "A lot of snow fell.",
    etymology: "Classical Tibetan 'kha-ba'."
  },
  {
    id: "dict-rgyatso",
    word: "Rgya-tso",
    tibetanScript: "\u0F62\u0F92\u0FB1\u0F0B\u0F58\u0F5A\u0F7C\u0F0D",
    persoArabicScript: "\u0631\u06AF\u06CC\u0627\u062A\u0633\u0648",
    ipa: "/rgja.tso/",
    meaning: "Ocean / Sea / Large Lake",
    urduMeaning: "\u0633\u0645\u0646\u062F\u0631 / \u062C\u06BE\u06CC\u0644",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Large water bodies. Retains prefixed cluster 'rgy-'.",
    exampleSentence: "Rgya-tso tschena re.",
    exampleTranslation: "The ocean is vast.",
    etymology: "Classical Tibetan 'rgya-mtsho'."
  },
  {
    id: "dict-ta",
    word: "Ta",
    tibetanScript: "\u0F62\u0F9F\u0F0D",
    persoArabicScript: "\u062A\u0627",
    ipa: "/ta/",
    meaning: "Horse",
    urduMeaning: "\u06AF\u06BE\u0648\u0691\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Horse. Retains the prefix 'rt-' in written Tibetan, pronounced as a voiceless retroflex or dental stop in Purgi.",
    exampleSentence: "Ta-la zhon-ba.",
    exampleTranslation: "To ride a horse.",
    etymology: "Classical Tibetan 'rta'."
  },
  {
    id: "dict-khuyi",
    word: "Khuyi",
    tibetanScript: "\u0F41\u0FB1\u0F72\u0F0D",
    persoArabicScript: "\u06A9\u06BE\u0648\u0626\u06CC",
    ipa: "/k\u02B0u.ji/",
    meaning: "Dog",
    urduMeaning: "\u06A9\u062A\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Dog. The genitive is 'khuyi-i' (of the dog).",
    exampleSentence: "Khuyi nang-gi sgo-la yod.",
    exampleTranslation: "The dog is at the door of the house.",
    etymology: "Classical Tibetan 'khyi'."
  },
  {
    id: "dict-bila",
    word: "Bila",
    tibetanScript: "\u0F56\u0FB1\u0F72\u0F0B\u0F63\u0F0D",
    persoArabicScript: "\u0628\u06CC\u0644\u0627",
    ipa: "/bi.la/",
    meaning: "Cat",
    urduMeaning: "\u0628\u0644\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A domestic cat.",
    exampleSentence: "Bila-is oma thungs.",
    exampleTranslation: "The cat drank milk.",
    etymology: "Classical Tibetan 'byi-la'."
  },
  {
    id: "dict-bal",
    word: "Bal",
    tibetanScript: "\u0F56\u0F63\u0F0D",
    persoArabicScript: "\u0628\u0627\u0644",
    ipa: "/bal/",
    meaning: "Wool",
    urduMeaning: "\u0627\u0648\u0646",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Sheep wool, crucial local material for warm woolen blankets and clothing (pattu).",
    exampleSentence: "Bal-i gonchas.",
    exampleTranslation: "Woolen clothes.",
    etymology: "Classical Tibetan 'bal'."
  },
  {
    id: "dict-lakh",
    word: "Lakh",
    tibetanScript: "\u0F63\u0F74\u0F42\u0F0D",
    persoArabicScript: "\u0644\u06A9\u06BE / \u0644\u06A9",
    ipa: "/lak/",
    meaning: "Sheep",
    urduMeaning: "\u0628\u06BE\u06CC\u0691",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Sheep. Retains final -g stop pronounced as -kh or -k in Purki, as studied by D.N.S. Bhat.",
    exampleSentence: "Lakh-is rtsa zos.",
    exampleTranslation: "The sheep ate grass.",
    etymology: "Classical Tibetan 'lug'."
  },
  {
    id: "dict-ra",
    word: "Ra",
    tibetanScript: "\u0F62\u0F0D",
    persoArabicScript: "\u0631\u0627",
    ipa: "/ra/",
    meaning: "Goat",
    urduMeaning: "\u0628\u06A9\u0631\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Goat, major livestock animal in high Ladakh valleys.",
    exampleSentence: "Ra-i rba.",
    exampleTranslation: "Goat's milk.",
    etymology: "Classical Tibetan 'ra' / 'ra-ma'."
  },
  {
    id: "dict-phalo",
    word: "Phalo",
    tibetanScript: "\u0F42\u0FB3\u0F44\u0F0B\u0F0D",
    persoArabicScript: "\u067E\u06BE\u0627\u0644\u0648",
    ipa: "/p\u02B0a.lo/",
    meaning: "Bull / Ox",
    urduMeaning: "\u0628\u06CC\u0644",
    partOfSpeech: "Noun",
    dialect: "purigi",
    definition: "Bull or ox used for ploughing valley terraced fields.",
    exampleSentence: "Phalo-is field rmos.",
    exampleTranslation: "The ox ploughed the field.",
    etymology: "Sino-Tibetan agricultural terms."
  },
  {
    id: "dict-bja",
    word: "Bja",
    tibetanScript: "\u0F56\u0FB1\u0F0D",
    persoArabicScript: "\u0628\u062C\u0627 / \u0628\u06CC\u0627",
    ipa: "/bja/",
    meaning: "Bird",
    urduMeaning: "\u067E\u0631\u0646\u062F\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A bird. Preserves the archaic bilabial-palatal cluster 'by-' as 'bj-' or 'by-'.",
    exampleSentence: "Bja ri-la phur-is.",
    exampleTranslation: "The bird flew to the mountain.",
    etymology: "Classical Tibetan 'bya'."
  },
  {
    id: "dict-nja",
    word: "Nja",
    tibetanScript: "\u0F49\u0F0D",
    persoArabicScript: "\u0646\u062C\u0627 / \u0646\u06CC\u0627",
    ipa: "/\u0272a/",
    meaning: "Fish",
    urduMeaning: "\u0645\u0686\u06BE\u0644\u06CC",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Fish.",
    exampleSentence: "Nja chu-la duk-pa.",
    exampleTranslation: "The fish stays in the water.",
    etymology: "Classical Tibetan 'nya'."
  },
  {
    id: "dict-sgo",
    word: "Sgo",
    tibetanScript: "\u0F66\u0F92\u0F7C\u0F0D",
    persoArabicScript: "\u0633\u06AF\u0648",
    ipa: "/sgo/",
    meaning: "Door / Gate",
    urduMeaning: "\u062F\u0631\u0648\u0627\u0632\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "The door of a building or room, keeping the archaic 'sg-' cluster pronounced.",
    exampleSentence: "Sgo thsogs!",
    exampleTranslation: "Shut the door!",
    etymology: "Classical Tibetan 'sgo'."
  },
  {
    id: "dict-thap",
    word: "Thap",
    tibetanScript: "\u0F50\u0F56\u0F0D",
    persoArabicScript: "\u062A\u06BE\u067E",
    ipa: "/t\u02B0ap/",
    meaning: "Stove / Hearth / Cooking fireplace",
    urduMeaning: "\u0686\u0648\u0644\u06C1\u0627",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Hearth or stove which is the center of Ladakhi family homes.",
    exampleSentence: "Thap-la me spar!",
    exampleTranslation: "Light fire in the hearth!",
    etymology: "Classical Tibetan 'thab' (fireplace)."
  },
  {
    id: "dict-turmang",
    word: "Turmang",
    tibetanScript: "\u0F50\u0F74\u0F62\u0F0B\u0F58\u0F0D",
    persoArabicScript: "\u062A\u0648\u0631\u0645\u0646\u06AF",
    ipa: "/tur.ma\u014B/",
    meaning: "Spoon",
    urduMeaning: "\u0686\u0645\u0686",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Household spoon.",
    exampleSentence: "Nga-la turmang chik chin.",
    exampleTranslation: "Give me a spoon.",
    etymology: "Classical Tibetan 'thur-ma' with nasal nominal suffix."
  },
  {
    id: "dict-tsampa",
    word: "Tsampa",
    tibetanScript: "\u0F62\u0FA9\u0F58\u0F0B\u0F54\u0F0D",
    persoArabicScript: "\u062A\u0633\u0645\u067E\u0627 / \u0633\u062A\u0648",
    ipa: "/tsam.pa/",
    meaning: "Roasted barley flour",
    urduMeaning: "\u0633\u062A\u0648",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Roasted barley flour, eaten daily mixed with salted butter tea.",
    exampleSentence: "Nga-is tsampa thungs.",
    exampleTranslation: "I ate/drank tsampa (porridge).",
    etymology: "Classical Tibetan 'rtsam-pa'."
  },
  {
    id: "dict-cha",
    word: "Cha",
    tibetanScript: "\u0F47\u0F0D",
    persoArabicScript: "\u0686\u0627\u0626\u06D2 / \u062C\u0627",
    ipa: "/d\u0292a/",
    meaning: "Tea / Salt tea",
    urduMeaning: "\u0686\u0627\u0626\u06D2",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "Tea. Frequently refers to traditional salty butter tea (gurgur cha).",
    exampleSentence: "Cha thung!",
    exampleTranslation: "Drink tea!",
    etymology: "Sino-Tibetan cognates."
  },
  {
    id: "dict-chik",
    word: "Chik",
    tibetanScript: "\u0F42\u0F45\u0F72\u0F42\u0F0D",
    persoArabicScript: "\u0686\u06A9",
    ipa: "/t\u0283ik/",
    meaning: "One",
    urduMeaning: "\u0627\u06CC\u06A9",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number one.",
    exampleSentence: "Butsa chik ongis.",
    exampleTranslation: "One boy came.",
    etymology: "Classical Tibetan 'gcig'."
  },
  {
    id: "dict-nis",
    word: "Nis",
    tibetanScript: "\u0F42\u0F49\u0F72\u0F66\u0F0D",
    persoArabicScript: "\u0646\u0633",
    ipa: "/nis/",
    meaning: "Two",
    urduMeaning: "\u062F\u0648",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number two.",
    exampleSentence: "Kanga nis.",
    exampleTranslation: "Two feet.",
    etymology: "Classical Tibetan 'gnyis'."
  },
  {
    id: "dict-sum",
    word: "Sum",
    tibetanScript: "\u0F42\u0F66\u0F74\u0F58\u0F0D",
    persoArabicScript: "\u0633\u0645",
    ipa: "/sum/",
    meaning: "Three",
    urduMeaning: "\u062A\u06CC\u0646",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number three.",
    exampleSentence: "Mi sum yod.",
    exampleTranslation: "There are three people.",
    etymology: "Classical Tibetan 'gsum'."
  },
  {
    id: "dict-bzhi",
    word: "Bzhi",
    tibetanScript: "\u0F56\u0F5E\u0F72\u0F0D",
    persoArabicScript: "\u0628\u0698\u06CC",
    ipa: "/b\u0292i/",
    meaning: "Four",
    urduMeaning: "\u0686\u0627\u0631",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number four, pronounced with voiced retroflex fricative.",
    exampleSentence: "Ta bzhi.",
    exampleTranslation: "Four horses.",
    etymology: "Classical Tibetan 'bzhi'."
  },
  {
    id: "dict-gnga",
    word: "Gnga",
    tibetanScript: "\u0F63\u0F94\u0F0D",
    persoArabicScript: "\u063A\u0646\u06AF\u0627",
    ipa: "/\u014Ba/",
    meaning: "Five",
    urduMeaning: "\u067E\u0627\u0646\u0686",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number five, retaining a velar nasal pronunciation.",
    exampleSentence: "Lakpa gnga.",
    exampleTranslation: "Five hands/fingers.",
    etymology: "Classical Tibetan 'lnga'."
  },
  {
    id: "dict-truk",
    word: "Truk",
    tibetanScript: "\u0F51\u0FB2\u0F74\u0F42\u0F0D",
    persoArabicScript: "\u0679\u0631\u06A9",
    ipa: "/truk/",
    meaning: "Six",
    urduMeaning: "\u0686\u06BE",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number six.",
    exampleSentence: "Bumo truk skul-la song.",
    exampleTranslation: "Six girls went to school.",
    etymology: "Classical Tibetan 'drug'."
  },
  {
    id: "dict-bdun",
    word: "Bdun",
    tibetanScript: "\u0F56\u0F51\u0F74\u0F53\u0F0D",
    persoArabicScript: "\u0628\u062F\u0646",
    ipa: "/bdun/",
    meaning: "Seven",
    urduMeaning: "\u0633\u0627\u062A",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number seven, preserving the initial bilabial stop prefix b-.",
    exampleSentence: "Nyima bdun.",
    exampleTranslation: "Seven days.",
    etymology: "Classical Tibetan 'bdun'."
  },
  {
    id: "dict-rgyat",
    word: "Rgyat",
    tibetanScript: "\u0F56\u0F62\u0F92\u0FB1\u0F51\u0F0D",
    persoArabicScript: "\u0631\u06AF\u06CC\u0627\u062A",
    ipa: "/rgjat/",
    meaning: "Eight",
    urduMeaning: "\u0622\u0679\u06BE",
    partOfSpeech: "Numeral",
    dialect: "purigi",
    definition: "The cardinal number eight.",
    exampleSentence: "Skarma rgyat nam-la yod.",
    exampleTranslation: "Eight stars are in the sky.",
    etymology: "Classical Tibetan 'brgyad'."
  },
  {
    id: "dict-rgu",
    word: "Rgu",
    tibetanScript: "\u0F51\u0F42\u0F74\u0F0D",
    persoArabicScript: "\u0631\u06AF\u0648",
    ipa: "/rgu/",
    meaning: "Nine",
    urduMeaning: "\u0646\u0648",
    partOfSpeech: "Numeral",
    dialect: "common",
    definition: "The number nine.",
    exampleSentence: "Khuyi rgu.",
    exampleTranslation: "Nine dogs.",
    etymology: "Classical Tibetan 'dgu'."
  },
  {
    id: "dict-hchustham",
    word: "Hchustham",
    tibetanScript: "\u0F56\u0F45\u0F74\u0F0D",
    persoArabicScript: "\u06C1\u0686\u0648\u0633\u062A\u06BE\u0645",
    ipa: "/ht\u0283us.t\u02B0am/",
    meaning: "Ten",
    urduMeaning: "\u062F\u0633",
    partOfSpeech: "Numeral",
    dialect: "purigi",
    definition: "The number ten.",
    exampleSentence: "Mi hchustham yod.",
    exampleTranslation: "There are ten people.",
    etymology: "Classical Tibetan 'bcu-tham-pa'."
  },
  {
    id: "dict-zochas",
    word: "Zo-chas",
    tibetanScript: "\u0F5F\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0632\u0648\u0686\u0633",
    ipa: "/zo.t\u0283as/",
    meaning: "To eat",
    urduMeaning: "\u06A9\u06BE\u0627\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "The action of consuming food. Ends in Purgi infinitive ending '-chas' as highlighted by D.N.S. Bhat.",
    exampleSentence: "Nga khurba zo-chas in.",
    exampleTranslation: "I want to eat bread.",
    etymology: "Classical Tibetan 'za-ba'."
  },
  {
    id: "dict-thungchas",
    word: "Thung-chas",
    tibetanScript: "\u0F60\u0F50\u0F74\u0F44\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u062A\u06BE\u0648\u0646\u06AF\u0686\u0633",
    ipa: "/t\u02B0u\u014B.t\u0283as/",
    meaning: "To drink",
    urduMeaning: "\u067E\u06CC\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "The action of drinking liquids.",
    exampleSentence: "Nga-la chu thung-chas in.",
    exampleTranslation: "I want to drink water.",
    etymology: "Classical Tibetan 'thung-ba'."
  },
  {
    id: "dict-chachas",
    word: "Cha-chas",
    tibetanScript: "\u0F60\u0F42\u0FB2\u0F7C\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0686\u0627\u0686\u0633",
    ipa: "/t\u0283a.t\u0283as/",
    meaning: "To go",
    urduMeaning: "\u062C\u0627\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "The action of walking or travelling away.",
    exampleSentence: "Kho Kargil-la cha-chas in.",
    exampleTranslation: "He wants to go to Kargil.",
    etymology: "Classical Tibetan 'gro-ba' / 'cha-ba'."
  },
  {
    id: "dict-ongchas",
    word: "Ong-chas",
    tibetanScript: "\u0F61\u0F7C\u0F44\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0627\u0648\u0646\u06AF\u0686\u0633",
    ipa: "/o\u014B.t\u0283as/",
    meaning: "To come",
    urduMeaning: "\u0622\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "The action of arriving or coming toward.",
    exampleSentence: "Nama nang-la ong-is.",
    exampleTranslation: "The bride came into the house.",
    etymology: "Classical Tibetan 'yong-ba'."
  },
  {
    id: "dict-ltapchas",
    word: "Ltap-chas / Lta-chas",
    tibetanScript: "\u0F63\u0F9F\u0F0B\u0F56\u0F0D",
    persoArabicScript: "\u0644\u062A\u0627\u067E\u0686\u0633",
    ipa: "/ltap.t\u0283as/",
    meaning: "To look / To see",
    urduMeaning: "\u062F\u06CC\u06A9\u06BE\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "To see or watch. Keeps the voiceless alveolar-dental cluster 'lt-'.",
    exampleSentence: "Ri-la ltap-chas.",
    exampleTranslation: "To look at the mountain.",
    etymology: "Classical Tibetan 'lta-ba'."
  },
  {
    id: "dict-sheschas",
    word: "Shes-chas",
    tibetanScript: "\u0F64\u0F7A\u0F66\u0F0B\u0F54\u0F0D",
    persoArabicScript: "\u0634\u06CC\u0633\u0686\u0633",
    ipa: "/\u0283es.t\u0283as/",
    meaning: "To know / understand",
    urduMeaning: "\u062C\u0627\u0646\u0646\u0627",
    partOfSpeech: "Verb (Infinitive)",
    dialect: "purigi",
    definition: "To possess knowledge or comprehension.",
    exampleSentence: "Nga-is Purgi shes-chas in.",
    exampleTranslation: "I know the Purgi language.",
    etymology: "Classical Tibetan 'shes-pa'."
  }
];

// server.ts
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Warning: GEMINI_API_KEY environment variable is not set. AI translation and tutor functions will run in simulated mode.");
      return null;
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.post("/api/translate", async (req, res) => {
  const { text, targetDialect, context } = req.body;
  if (!text || !targetDialect) {
    return res.status(400).json({ error: "Missing text or targetDialect parameters." });
  }
  const ai = getGeminiClient();
  if (!ai) {
    const mockTranslations = {
      "hello": {
        translation: "Khamzang",
        tibetanScript: "\u0F41\u0F58\u0F66\u0F0B\u0F56\u0F5F\u0F44\u0F0B\u0F0D",
        persoArabicScript: "\u062E\u0645\u0632\u0646\u06AF",
        phoneticBreakdown: "Kham-zang (kh- aspirated, z- voiced)",
        grammarNotes: "Traditional respectful greeting used in both Balti and Purik. Literally translates as 'Good state/health'."
      },
      "thank you": {
        translation: "Joo",
        tibetanScript: "\u0F47\u0F74\u0F0D",
        persoArabicScript: "\u062C\u0648",
        phoneticBreakdown: "Joo (long 'oo' sound)",
        grammarNotes: "General respectful word for hello, goodbye, and thank you in Ladakh and Baltistan."
      },
      "where are you going?": {
        translation: "Khyang khari cha-chas in?",
        tibetanScript: "\u0F41\u0FB1\u0F44\u0F0B\u0F41\u0F0B\u0F62\u0F72\u0F0B\u0F46\u0F0B\u0F46\u0F66\u0F0B\u0F68\u0F72\u0F53\u0F0D",
        persoArabicScript: "\u06A9\u06BE\u06CC\u0627\u0646\u06AF \u06A9\u06BE\u0627\u0631\u06CC \u0686\u0627\u0686\u0633 \u0627\u0650\u0646\u061F",
        phoneticBreakdown: "Khyang (You) kha-ri (where-to) cha-chas (to-go) in (are)?",
        grammarNotes: "Present progressive interrogative structure. 'cha-chas' is the infinitive 'to go' combined with auxiliary identity verb 'in'."
      },
      "yang thik yota": {
        translation: "Translation: Are you fine?",
        tibetanScript: "\u0F61\u0F44\u0F0B\u0F50\u0F72\u0F42\u0F0B\u0F61\u0F7C\u0F51\u0F0B\u0F4F\u0F0D",
        persoArabicScript: "\u06CC\u0627\u0646\u06AF \u062A\u06BE\u06CC\u06A9 \u06CC\u0648\u062A\u0627\u061F",
        phoneticBreakdown: "Yang (again/also) + thik (fine/well) + yot-a (interrogative of 'to exist/be')",
        grammarNotes: "The standard colloquial way to say 'Are you fine / well?' in Balti and Purigi. It uses 'yot-a', the question form of auxiliary 'yod'."
      },
      "yang thik yot-a": {
        translation: "Translation: Are you fine?",
        tibetanScript: "\u0F61\u0F44\u0F0B\u0F50\u0F72\u0F42\u0F0B\u0F61\u0F7C\u0F51\u0F0B\u0F4F\u0F0D",
        persoArabicScript: "\u06CC\u0627\u0646\u06AF \u062A\u06BE\u06CC\u06A9 \u06CC\u0648\u062A\u0627\u061F",
        phoneticBreakdown: "Yang (again/also) + thik (fine/well) + yot-a (interrogative of 'to exist/be')",
        grammarNotes: "The standard colloquial way to say 'Are you fine / well?' in Balti and Purigi. It uses 'yot-a', the question form of auxiliary 'yod'."
      }
    };
    const lowercase = text.toLowerCase().trim();
    if (mockTranslations[lowercase]) {
      return res.json({
        success: true,
        ...mockTranslations[lowercase],
        isSimulated: true
      });
    }
    const simulatedWord = text.split(" ").map((w) => w + "s").join(" ");
    return res.json({
      success: true,
      translation: `Khamzang ${text}`,
      tibetanScript: "\u0F41\u0F58\u0F66\u0F0B\u0F56\u0F5F\u0F44\u0F0B\u0F0D",
      persoArabicScript: "\u062E\u0645\u0632\u0646\u06AF",
      phoneticBreakdown: `Pronounced: [${simulatedWord}] with typical Tibeto-Burman consonant stress.`,
      grammarNotes: "Simulated response (Configure GEMINI_API_KEY in secrets for live high-precision translation). Balti and Purik retain classical Tibetan structures.",
      isSimulated: true
    });
  }
  try {
    const prompt = `Translate the following sentence/phrase: "${text}".
This request can be English-to-${targetDialect} or ${targetDialect}-to-English.
- If the input is in English or Urdu, translate it into the ${targetDialect} language (a Tibeto-Burman language of Baltistan/Kargil).
- If the input is in ${targetDialect} (such as "Yang Thik Yota" or other regional phrases), translate it into simple, clear English.

Provide the answer strictly in JSON format matching the following structure:
{
  "translation": "Translated term. First of all, state what it says simply and clearly! If translating a regional dialect phrase to English, the field MUST look like: 'Translation: [English translation]' (e.g. 'Translation: Are you fine?').",
  "tibetanScript": "Translated written form in Tibetan Script (Yige)",
  "persoArabicScript": "Translated written form in Persian-Arabic Balti/Purik alphabet",
  "phoneticBreakdown": "Breakdown of the pronunciation, pointing out any unique phonetic nuances, especially Old Tibetan consonant clusters (like pr-, br-, sk-, hl-)",
  "grammarNotes": "Detailed explanation of grammar cases used (e.g., ergative -is/-gis, dative -la, genitive -i/-gi, or progressive verb conjugations -ches in/yo)"
}
Additional context: ${context || "None"}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert linguist specializing in Western Archaic Tibetan languages (Balti and Purik/Purigi). Always provide highly accurate, simple translations first. If the input is in the regional language (e.g., 'Yang Thik Yota'), the 'translation' field MUST begin with 'Translation: ' followed by the simple English meaning (e.g., 'Translation: Are you fine?'). Keep semantics and phonetics supplementary."
      }
    });
    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({ success: true, ...parsed });
  } catch (error) {
    console.error("Gemini translation error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during AI translation." });
  }
});
app.post("/api/chat", async (req, res) => {
  const { messages, targetDialect } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }
  const ai = getGeminiClient();
  if (!ai) {
    const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "Khamzang! I am your Kargili Purki/Purgi language coach. Since the Gemini API key is not fully loaded in the environment right now, I am running in local offline tutorial mode. Let's practice! Ask me about: 'noun suffixes', 'pronouns', or try typing 'hello' or 'thank you'.";
    if (lastUserMessage.includes("yang thik yota") || lastUserMessage.includes("yang thik yot-a") || lastUserMessage.includes("are you fine")) {
      reply = `**Translation: Are you fine?**

In Kargili Purki/Purgi, "Yang Thik Yota" is the traditional, colloquial way to ask "Are you fine?" or "Are you doing well?".

**Linguistic Breakdown:**
- **Yang**: Meaning "again" or "also" (implying "all is well as before").
- **Thik**: Meaning "fine", "correct", or "okay".
- **Yot-a**: The interrogative form of "yod" (to be/exist). The suffix "-a" indicates a question.

Would you like to try replying with "Yang thik yod" (I am fine too)?`;
    } else if (lastUserMessage.includes("suffix") || lastUserMessage.includes("case")) {
      reply = "In Kargili Purki/Purgi, nouns take suffixes for grammar cases:\n1. **Genitive (-i or -gi)**: 'nga-i' (my), 'nang-gi' (of the house).\n2. **Dative/Locative (-la)**: 'nga-la' (to me), 'nang-la' (in/at the house).\n3. **Ergative (-is or -gis)**: 'nga-is zos' (by me eaten). This is extremely unique to Tibeto-Burman grammar!";
    } else if (lastUserMessage.includes("hello") || lastUserMessage.includes("greetings")) {
      reply = "To say hello, we say **Khamzang** (or Khamzang thuk). To reply respectfully, say **Joo** or **Khamzang thuk**! Give it a try!";
    } else if (lastUserMessage.includes("pronoun") || lastUserMessage.includes("i ") || lastUserMessage.includes("you")) {
      reply = "Here are the core personal pronouns in Kargili Purgi and Purki:\n- **I**: *nga*\n- **We**: *ngatang* (inclusive) / *ngadang*\n- **You**: *khyang* (standard) or *nyer* (honorific/polite)\n- **He/She**: *kho* / *mo*";
    }
    return res.json({
      success: true,
      reply,
      isSimulated: true
    });
  }
  try {
    const systemInstruction = `You are an encouraging and deeply informative native Kargili Purki/Purgi Language Tutor. 
While you can assist with both Balti and Purgi dialects, your teaching and explanations must lean heavily towards and be highly optimized for the Kargili Purgi/Purki dialect, showcasing its unique phonetic, dative, and historical preservation features.
The user is currently studying the ${targetDialect || "Kargili Purgi"} dialect.
Help them learn vocabulary, translate their inputs, explain grammatical conjugations (like Purigi infinitive ending in -chas, ergative noun suffixes), and correct any mistakes in a kind, simple and constructive way.

CRITICAL DIRECTIVE: If the user types a regional phrase like "Yang Thik Yota" or any Balti/Purgi word, the very first line of your response must state the English translation simply and clearly (e.g. "**Translation: Are you fine?**") before explaining any semantics, phonology, or grammar. Always make translations simple and clear first.

Keep your answers engaging, formatted with clear Markdown, and include phonetic tips for how to pronounce words (retaining ancient Tibetan clusters like rgy-, skr-, bgy-).
Avoid overly generic greetings; maintain the immersive persona of a regional Kargil linguist tutor.`;
    const formattedContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });
    return res.json({ success: true, reply: response.text });
  } catch (error) {
    console.error("Gemini Chat Coach error:", error);
    return res.status(500).json({ error: error.message || "An error occurred during tutor session." });
  }
});
app.get("/api/courses", (req, res) => {
  const courses = [
    {
      id: "course-1",
      title: "Miracles of Human Language: An Introduction to Linguistics",
      provider: "Coursera",
      description: "Offered by Universiteit Leiden. Learn the core foundations of phonetics, syntax, semantics, and how minority languages conserve ancient structural rules.",
      url: "https://www.coursera.org/learn/human-language",
      tags: ["Linguistics", "Syntax", "Minority Languages"],
      level: "Beginner",
      duration: "4 weeks (approx. 16 hours)"
    },
    {
      id: "course-2",
      title: "Introduction to Tibetan Language and Dialects",
      provider: "Coursera",
      description: "Explore Classical Tibetan grammar, writing systems (Uchen Script), and how archaic dialects like Balti and Purigi branched off while keeping historic consonant prefixes.",
      url: "https://www.coursera.org/learn/tibetan-buddhist-culture",
      tags: ["Tibeto-Burman", "Phonology", "Himalayan Culture"],
      level: "Intermediate",
      duration: "5 weeks"
    },
    {
      id: "course-3",
      title: "Grammar, Syntax, and Language Evolution",
      provider: "Coursera",
      description: "Analyzes morphological structures, postpositions, and case-marking systems across the Sino-Tibetan language families.",
      url: "https://www.coursera.org/specializations/linguistics",
      tags: ["Grammar Case Suffixes", "Sino-Tibetan", "Typology"],
      level: "Advanced",
      duration: "12 weeks"
    },
    {
      id: "course-4",
      title: "Preserving Endangered Indigenous Languages",
      provider: "Linguistic Society",
      description: "Documentation methods for recording native speakers, creating transcription corpora, and building digital dictionaries for oral traditions like Purik/Purigi.",
      url: "https://www.khanacademy.org/humanities/grammar",
      // Best Khan Academy match for general structural grammar support
      tags: ["Preservation", "Native Transcripts", "Phonetic Data"],
      level: "Beginner",
      duration: "Self-paced"
    }
  ];
  return res.json({ success: true, courses });
});
var suggestionsStore = [
  {
    id: "sug-demo-1",
    word: "Zan-thsos",
    tibetanScript: "\u0F5F\u0F53\u0F0B\u0F5A\u0F7C\u0F66\u0F0D",
    persoArabicScript: "\u0632\u0627\u0646 \u062B\u0648\u0633",
    ipa: "/zan.t\u02B0os/",
    meaning: "Vegetable barley broth / stew",
    urduMeaning: "\u0633\u0628\u0632\u06CC\u0648\u06BA \u0648\u0627\u0644\u0627 \u0633\u0679\u0648 / \u062F\u0644\u06CC\u06C1",
    partOfSpeech: "Noun",
    dialect: "common",
    definition: "A traditional slow-cooked Himalayan broth consisting of barley flour noodles, mountain herbs, and regional wild turnips.",
    exampleSentence: "Ama-is khon-la zan-thsos cha chin.",
    exampleTranslation: "Mother gave them vegetable barley broth.",
    etymology: "From Balti/Purigi zan (barley dough/meal) + thsos (cooked vegetable broth).",
    status: "pending",
    submittedBy: "Ali Raza",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
app.get("/api/dictionary", (req, res) => {
  const approvedSuggestions = suggestionsStore.filter((s) => s.status === "approved").map((s) => ({
    id: s.id,
    word: s.word,
    tibetanScript: s.tibetanScript,
    persoArabicScript: s.persoArabicScript,
    ipa: s.ipa,
    meaning: s.meaning,
    urduMeaning: s.urduMeaning,
    partOfSpeech: s.partOfSpeech,
    dialect: s.dialect,
    definition: s.definition,
    exampleSentence: s.exampleSentence,
    exampleTranslation: s.exampleTranslation,
    etymology: s.etymology
  }));
  return res.json({
    success: true,
    entries: [...DICTIONARY, ...approvedSuggestions]
  });
});
app.get("/api/suggestions", (req, res) => {
  return res.json({ success: true, suggestions: suggestionsStore });
});
app.post("/api/suggestions", (req, res) => {
  const {
    word,
    tibetanScript,
    persoArabicScript,
    ipa,
    meaning,
    urduMeaning,
    partOfSpeech,
    dialect,
    definition,
    exampleSentence,
    exampleTranslation,
    etymology,
    submittedBy
  } = req.body;
  if (!word || !meaning || !partOfSpeech || !dialect || !definition) {
    return res.status(400).json({ error: "Required fields are missing: word, meaning, partOfSpeech, dialect, and definition are required." });
  }
  const newSuggestion = {
    id: `sug-${Date.now()}`,
    word: word.trim(),
    tibetanScript: tibetanScript?.trim() || "",
    persoArabicScript: persoArabicScript?.trim() || "",
    ipa: ipa?.trim() || "/unknown/",
    meaning: meaning.trim(),
    urduMeaning: urduMeaning?.trim() || "",
    partOfSpeech: partOfSpeech.trim(),
    dialect,
    definition: definition.trim(),
    exampleSentence: exampleSentence?.trim() || "",
    exampleTranslation: exampleTranslation?.trim() || "",
    etymology: etymology?.trim() || "",
    status: "pending",
    submittedBy: submittedBy?.trim() || "Anonymous Learner",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  suggestionsStore.push(newSuggestion);
  return res.json({ success: true, suggestion: newSuggestion });
});
app.post("/api/suggestions/:id/approve", (req, res) => {
  const { id } = req.params;
  const sug = suggestionsStore.find((s) => s.id === id);
  if (!sug) {
    return res.status(404).json({ error: "Suggestion not found." });
  }
  sug.status = "approved";
  return res.json({ success: true, suggestion: sug });
});
app.post("/api/suggestions/:id/reject", (req, res) => {
  const { id } = req.params;
  const index = suggestionsStore.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Suggestion not found." });
  }
  suggestionsStore[index].status = "rejected";
  return res.json({ success: true, id });
});
app.get("/api/resources", (req, res) => {
  const resources = [
    {
      id: "res-1",
      title: "Grokipedia Purigi Language Guide",
      provider: "Grokipedia",
      description: "Detailed linguistic encyclopedia analyzing the phonology, archaic syntax, and historical vocabulary of the Purgi (Purigi) language spoken in Kargil.",
      url: "https://grokipedia.com/page/Purgi_language",
      tags: ["Purigi Dialect", "Grammar", "Phonetics", "Kargil Valley"],
      category: "Encyclopedia"
    },
    {
      id: "res-2",
      title: "Balti Adab - Language & Literary Archives",
      provider: "Balti Adab",
      description: "A premier cultural preservation initiative hosting Balti texts, poetry databases, orthographic writing manuals, and classical literature collections.",
      url: "https://baltiadab.com/en/balti-language",
      tags: ["Balti Literature", "Preservation", "Poetry", "Skardu"],
      category: "Archive"
    },
    {
      id: "res-3",
      title: "OpenBalti Digital Dictionary",
      provider: "OpenBalti",
      description: "An open, interactive English-Balti digital dictionary compiling extensive vocabulary lists, IPA transcriptions, and cultural references.",
      url: "https://openbalti.com/dictionary",
      tags: ["Dictionary", "Vocabulary", "IPA Guide", "Interactive"],
      category: "Lexicon"
    }
  ];
  return res.json({ success: true, resources });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
