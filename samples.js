"use strict";

/* -------------------- Sample lessons --------------------
 * Pre-expanded demo lessons for the landing page, per UI language: the
 * explanations are written in the UI language, and the lesson that would
 * teach the UI language itself is swapped for an English one. These are
 * view-only previews — they are never written into saved state.
 */
const SAMPLE_PLANS_BY_LOCALE = {
  en: [
  {
    id: "plan-sample-es",
    language: "Spanish",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-es",
      title: "Ser vs. estar: two ways to be",
      grammar: "ser vs. estar",
      description: "Spanish has two verbs where English has just one \"to be\". Ser tells us what something is — identity, origin, profession, essence. Estar tells us how something is — feelings, conditions, and location. Mixing them up rarely blocks communication, but mastering the split is what makes your Spanish sound natural, and a handful of adjectives even change meaning depending on which verb you choose.",
      expanded: true,
      sections: [
        { heading: "Two verbs, one English \"to be\"", body: "English packs everything into to be: I am a teacher, I am tired, I am in Madrid. Spanish splits those three sentences across two different verbs: Soy profesor (identity → ser), Estoy cansado (state → estar), Estoy en Madrid (location → estar). Both verbs are irregular, so learn them as little chants. Ser in the present tense: soy, eres, es, somos, sois, son. Estar: estoy, estás, está, estamos, estáis, están. Notice the written accents on estás and está — they mark the stressed syllable and distinguish these forms in writing." },
        { heading: "Ser: what something is", body: "Use ser for the DNA of a thing. Identity and names: Soy Ana. (I am Ana.) Origin and nationality: Marta es de Colombia. (Marta is from Colombia.) Somos mexicanos. (We are Mexican.) Profession: Mi madre es médica. (My mother is a doctor.) Inherent character and appearance: La casa es vieja. (The house is old — that is its character.) Pedro es alto. (Pedro is tall.) Possession: El libro es de Juan. (The book is Juan's.) A useful test: if the sentence answers \"what kind of thing is this, deep down?\", reach for ser." },
        { heading: "Ser also tells the time — and hosts the party", body: "Two uses of ser surprise learners. First, clock time and dates always take ser: Son las tres. (It's three o'clock.) Hoy es martes. (Today is Tuesday.) Second, events: when \"is\" means \"takes place\", Spanish uses ser even for a location. La fiesta es en mi casa. (The party is at my house — it happens there.) Compare: Mi casa está en la calle Mayor. (My house is located on Calle Mayor.) Things are located with estar; events happen with ser." },
        { heading: "Estar: how something is right now", body: "Estar covers conditions that could change. Feelings: Estoy feliz hoy. (I'm happy today.) Physical states: Estás cansado. (You're tired.) El café está frío. (The coffee is cold.) Situations: La tienda está cerrada. (The shop is closed.) Estar also builds the progressive tenses: Estoy estudiando español. (I am studying Spanish right now.) A memory hook: estar comes from the Latin stare, \"to stand\" — it describes how things stand at this moment." },
        { heading: "Estar: where things are", body: "The location of people and things always takes estar, no matter how permanent it is: Estamos en la cocina. (We're in the kitchen.) Madrid está en España. (Madrid is in Spain — permanent, and still estar!) This is the single most common ser/estar mistake, because \"Madrid never moves\" makes location feel like essence. Resist the logic: position is position, so it gets estar. Only events (previous section) break this rule." },
        { heading: "Same adjective, different meaning", body: "A small set of adjectives shifts meaning with the verb, and they are worth memorizing as pairs. Ana es lista. (Ana is clever.) / Ana está lista. (Ana is ready.) La manzana es verde. (The apple is green in color.) / La manzana está verde. (The apple is unripe.) Pedro es aburrido. (Pedro is a boring person.) / Pedro está aburrido. (Pedro is bored right now.) El chico es rico. (The boy is rich.) / La paella está rica. (The paella is delicious.) When in doubt, ask yourself: essence or state?" }
      ],
      vocab: [
        { term: "ser", ipa: "seɾ", pos: "verb", translation: "to be (identity, essence)", example: "Soy profesor. — I am a teacher." },
        { term: "estar", ipa: "esˈtaɾ", pos: "verb", translation: "to be (state, place)", example: "Estoy en casa. — I am at home." },
        { term: "cansado", ipa: "kanˈsaðo", pos: "adjective", translation: "tired", example: "Estás cansado hoy. — You are tired today." },
        { term: "listo", ipa: "ˈlisto", pos: "adjective", translation: "clever / ready", example: "¿Estás listo? — Are you ready?" },
        { term: "aburrido", ipa: "aβuˈriðo", pos: "adjective", translation: "boring / bored", example: "La película es aburrida. — The movie is boring." },
        { term: "frío", ipa: "ˈfɾio", pos: "adjective", translation: "cold", example: "La sopa está fría. — The soup is cold." },
        { term: "feliz", ipa: "feˈliθ", pos: "adjective", translation: "happy", example: "Estoy feliz hoy. — I am happy today." },
        { term: "cerrado", ipa: "θeˈraðo", pos: "adjective", translation: "closed", example: "La tienda está cerrada. — The shop is closed." },
        { term: "verde", ipa: "ˈbeɾðe", pos: "adjective", translation: "green / unripe", example: "La manzana está verde. — The apple is unripe." },
        { term: "rico", ipa: "ˈriko", pos: "adjective", translation: "rich / delicious", example: "La paella está rica. — The paella is delicious." }
      ],
      exercises: [
        { kind: "open", prompt: "Fill in ser or estar: \"Yo ___ de México, pero ahora ___ en Madrid.\"", answer: "soy / estoy", hint: "Origin first, location second." },
        { kind: "open", prompt: "Translate: \"The coffee is cold.\"", answer: "El café está frío.", hint: "A state that can change." },
        { kind: "open", prompt: "Explain the difference: \"Pedro es aburrido\" vs. \"Pedro está aburrido\".", answer: "With ser, Pedro is a boring person; with estar, Pedro is bored right now." },
        { kind: "open", prompt: "Choose the verb and explain: \"La fiesta ___ en el restaurante.\"", answer: "es — events take ser even when talking about location.", hint: "Is this a thing sitting somewhere, or something happening?" },
        { kind: "open", prompt: "Translate: \"My mother is a doctor and today she is tired.\"", answer: "Mi madre es médica y hoy está cansada." }
      ],
      scenario: { title: "Meeting your friend's family", details: "You've arrived at a Spanish friend's family dinner. Introduce yourself — who you are, where you're from, what you do, and how you're feeling after the trip — and ask the family about themselves, choosing ser or estar correctly as you go. Bonus: compliment the food with estar rico." }
    }
  },
  {
    id: "plan-sample-ja",
    language: "Japanese",
    level: "Absolute beginner",
    lesson: {
      id: "lesson-sample-ja",
      title: "Hiragana: your first ten characters",
      grammar: "hiragana あ–こ",
      description: "Japanese mixes three writing systems, and hiragana is the one everything else stands on: a syllabary where each character is exactly one sound, used for grammar, native words, and spelling out anything else. This lesson covers the first two rows — the five vowels and the k-row. Ten characters is already enough to read real Japanese words, and the pattern you learn here repeats through the whole script.",
      expanded: true,
      alphabet: [
        { character: "あ", romanization: "a", ipa: "a", group: "Vowels", note: "Like the a in \"father\"." },
        { character: "い", romanization: "i", ipa: "i", group: "Vowels", note: "Like the ee in \"see\", but short." },
        { character: "う", romanization: "u", ipa: "ɯ", group: "Vowels", note: "Lips relaxed, not rounded like English oo." },
        { character: "え", romanization: "e", ipa: "e", group: "Vowels", note: "Like the e in \"pet\"." },
        { character: "お", romanization: "o", ipa: "o", group: "Vowels", note: "A pure o — no glide at the end." },
        { character: "か", romanization: "ka", ipa: "ka", group: "K-row", note: "k + a" },
        { character: "き", romanization: "ki", ipa: "ki", group: "K-row", note: "k + i" },
        { character: "く", romanization: "ku", ipa: "kɯ", group: "K-row", note: "k + u" },
        { character: "け", romanization: "ke", ipa: "ke", group: "K-row", note: "k + e" },
        { character: "こ", romanization: "ko", ipa: "ko", group: "K-row", note: "k + o" }
      ],
      sections: [
        { heading: "Japan's three scripts — and why hiragana comes first", body: "Written Japanese weaves together three systems. Kanji are characters borrowed from Chinese that carry meaning (日 \"sun\", 語 \"language\"). Katakana spells foreign loanwords (コーヒー kōhī, \"coffee\"). Hiragana is the workhorse: it writes verb endings, particles, and native words, and it can spell out anything you don't know the kanji for. Children's books are written entirely in it, and furigana — the tiny reading hints printed above kanji in manga and textbooks — are hiragana too. Learn it first and the whole language opens up." },
        { heading: "One character, one beat", body: "Hiragana is a syllabary, not an alphabet: each character is one mora, one even beat of sound. あい (ai) \"love\" is two beats, a-i, pronounced with equal length. There are no silent letters, no spelling surprises — what you see is exactly what you say, every single time. Japanese rhythm ticks along like a metronome, and giving every character its full, even beat is half the secret to a natural-sounding accent. Say each word in this lesson out loud, tapping the beats on the table." },
        { heading: "The five vowels: あ い う え お", body: "Every sound in Japanese is built on just five vowels, always pronounced the same way. あ (a) as in \"father\". い (i) as in \"see\", but short. う (u) is the tricky one: keep your lips relaxed and unrounded, quite unlike English \"oo\". え (e) as in \"pet\". お (o) is a clean, pure o with no \"w\" glide at the end — English speakers tend to say \"oh-u\", so cut the tail off. These five characters open every hiragana chart you will ever see, and their order — a, i, u, e, o — is the alphabetical order of Japanese dictionaries." },
        { heading: "Add a consonant: the k-row", body: "Here is the beautiful part: the rest of hiragana recycles those same five vowels behind different consonants, always in the same order. Add k and you get か (ka), き (ki), く (ku), け (ke), こ (ko). That's it — you now understand the structure of the entire chart. Each new row costs almost nothing: learn the consonant, reuse the vowels. A sneak preview of how far this system stretches: two small dots (dakuten) voice a consonant, turning か (ka) into が (ga). One pattern, endlessly reused." },
        { heading: "Your first real words", body: "With ten characters you can already read genuine Japanese: あい (ai) \"love\", いえ (ie) \"house\", うえ (ue) \"above\", えき (eki) \"station\", かお (kao) \"face\", こえ (koe) \"voice\", あき (aki) \"autumn\", かき (kaki) \"persimmon\", あお (ao) \"blue\". Read each one aloud slowly, one even beat per character, then again at natural speed. Doubled vowels simply get two beats: ああ (ā) is \"aa\", held twice as long. This is why Japanese spelling is so friendly — reading and writing never drift apart." },
        { heading: "How to practice", body: "Write each character ten times while saying its sound out loud — hand, eye, and ear reinforce each other. Follow the stroke order shown in the chart (top to bottom, left to right); it looks pedantic but it makes your writing legible and fast, and every chart you'll ever see assumes it. Then cover the romanization column in the vocabulary table and read the words from the hiragana alone. When あき stops being \"a puzzle\" and starts being autumn, the characters have moved into long-term memory. Ten minutes a day beats an hour once a week." }
      ],
      vocab: [
        { term: "あい", ipa: "ai", pos: "noun", translation: "love", example: "あい (ai) — love" },
        { term: "いえ", ipa: "ie", pos: "noun", translation: "house", example: "いえ (ie) — house" },
        { term: "うえ", ipa: "ɯe", pos: "noun", translation: "above, top", example: "うえ (ue) — above" },
        { term: "えき", ipa: "eki", pos: "noun", translation: "station", example: "えき (eki) — station" },
        { term: "かお", ipa: "kao", pos: "noun", translation: "face", example: "かお (kao) — face" },
        { term: "こえ", ipa: "koe", pos: "noun", translation: "voice", example: "こえ (koe) — voice" },
        { term: "あき", ipa: "aki", pos: "noun", translation: "autumn", example: "あき (aki) — autumn" },
        { term: "あお", ipa: "ao", pos: "noun", translation: "blue", example: "あお (ao) — blue" }
      ],
      exercises: [
        { kind: "open", prompt: "Write in romaji: あき", answer: "aki (autumn)" },
        { kind: "open", prompt: "Write in hiragana: k-o-e (voice)", answer: "こえ" },
        { kind: "open", prompt: "Which character is \"ku\"?", answer: "く" },
        { kind: "open", prompt: "Read this and give the meaning: いえ", answer: "ie — house" },
        { kind: "open", prompt: "Spell \"kaki\" (persimmon) in hiragana, then say how many beats it has.", answer: "かき — two beats (ka-ki)." }
      ],
      scenario: { title: "Hiragana reading game", details: "Your tutor shows you short words written only with あ–こ characters. Read each one aloud in romaji, then guess the meaning. The tutor gives friendly hints when you're stuck, and speeds up as you warm up. Ask them to quiz you in both directions — romaji to hiragana too." }
    }
  },
  {
    id: "plan-sample-ko",
    language: "Korean",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-ko",
      title: "Ordering at a café: 주세요",
      grammar: "polite requests with 주세요",
      description: "One pattern unlocks every café, restaurant, market stall, and convenience store in Korea: [thing] 주세요 (juseyo) — \"please give me ...\". This lesson builds the whole café visit around it: naming your drink, counting cups the Korean way, asking the price, paying, and saying thanks. By the end you can walk up to a counter in Seoul and get exactly what you want, politely.",
      expanded: true,
      sections: [
        { heading: "One pattern to rule every counter", body: "Korean has several levels of politeness, and picking the right one paralyzes beginners. Good news: for shopping and ordering, 주세요 (juseyo) is always safe. It literally means \"please give (me)\", it belongs to the standard polite register (해요체), and no barista, shopkeeper, or waiter will ever find it rude or overly stiff. You will hear Koreans of every age use exactly this form at every counter in the country. Master this one word and you can transact anywhere." },
        { heading: "The pattern: [thing] + 주세요", body: "Put whatever you want directly in front of 주세요: 커피 주세요 (keopi juseyo) \"Coffee, please.\" 물 주세요 (mul juseyo) \"Water, please.\" 이거 주세요 (igeo juseyo) \"This one, please\" — the universal escape hatch when you don't know a word: just point and say it. Notice what's missing compared to English: no \"could I have\", no \"I would like\". Korean packs the politeness into the verb ending -세요, so the sentence stays short and completely courteous at the same time." },
        { heading: "Counting drinks: native numbers + 잔", body: "Korean counts objects with native numbers plus a counter word. Drinks take 잔 (jan), \"cup\": 한 잔 (han jan) one cup, 두 잔 (du jan) two cups, 세 잔 (se jan) three, 네 잔 (ne jan) four. The order is thing + number + counter + 주세요: 아메리카노 두 잔 주세요 (amerikano du jan juseyo) \"Two americanos, please.\" Yes — the number comes after the noun, the opposite of English. If counters feel like too much on day one, skip them: 아메리카노 주세요 with two fingers up works fine. But 잔 instantly makes you sound like you've done this before." },
        { heading: "Hot, iced, and reading the menu", body: "Korean café menus are surprisingly readable, because most drink names are English loanwords written in hangul: 아메리카노 (amerikano), 라떼 (latte), 주스 (juseu, juice). For temperature, put the word first: 아이스 (aiseu) \"iced\" — 아이스 아메리카노 주세요. For hot drinks you'll hear 따뜻한 (ttatteuthan) \"warm/hot\": 따뜻한 라떼 주세요. Korea takes its iced coffee seriously — iced americanos are ordered year-round, even in January, so you'll fit right in either way." },
        { heading: "Paying: 얼마예요? and card culture", body: "To ask the price: 얼마예요? (eolmayeyo?) \"How much is it?\" Prices come in won, and you'll mostly hear thousands: 사천 원 (sacheon won) is 4,000 won. Don't panic about big numbers — the register always displays the total, so treat the spoken price as listening practice with training wheels. Korea is one of the most card-friendly countries on earth; say 카드로 할게요 (kadeuro halgeyo) \"I'll pay by card\", tap, and you're done. Cash works too, but nobody expects it." },
        { heading: "For here, to go, and saying thanks", body: "After you order, the classic follow-up question is 드시고 가세요? (deusigo gaseyo?) \"Will you drink it here?\" Answer 네 (ne) \"yes\" to stay, or 포장이요 (pojang-iyo) \"to go, please\" to take it away. When your drink lands on the counter: 감사합니다 (gamsahamnida) \"thank you\" — the full, safe, formal version that works everywhere. You'll also hear the slightly softer 감사해요 (gamsahaeyo) between the staff themselves. Collect your drink, nod, and enjoy: you just completed an entire transaction in Korean." }
      ],
      vocab: [
        { term: "커피", ipa: "kʰʌpʰi", pos: "noun", translation: "coffee", example: "커피 주세요. (keopi juseyo) — Coffee, please." },
        { term: "물", ipa: "mul", pos: "noun", translation: "water", example: "물 주세요. (mul juseyo) — Water, please." },
        { term: "아메리카노", ipa: "amerikʰano", pos: "noun", translation: "americano", example: "아메리카노 두 잔 주세요. — Two americanos, please." },
        { term: "주세요", ipa: "tɕusejo", pos: "verb (polite)", translation: "please give me", example: "이거 주세요. (igeo juseyo) — This one, please." },
        { term: "잔", ipa: "tɕan", pos: "counter", translation: "cup, glass", example: "두 잔 (du jan) — two cups" },
        { term: "아이스", ipa: "aisɯ", pos: "noun", translation: "iced", example: "아이스 아메리카노 주세요. — An iced americano, please." },
        { term: "얼마예요", ipa: "ʌlmajejo", pos: "phrase", translation: "how much is it?", example: "이거 얼마예요? (igeo eolmayeyo) — How much is this?" },
        { term: "카드", ipa: "kʰadɯ", pos: "noun", translation: "card", example: "카드로 할게요. (kadeuro halgeyo) — I'll pay by card." },
        { term: "포장", ipa: "pʰodʑaŋ", pos: "noun", translation: "takeout, to go", example: "포장이요. (pojang-iyo) — To go, please." },
        { term: "감사합니다", ipa: "kamsahamnida", pos: "phrase", translation: "thank you", example: "감사합니다! (gamsahamnida) — Thank you!" }
      ],
      exercises: [
        { kind: "open", prompt: "Order one coffee, politely.", answer: "커피 (한 잔) 주세요. (keopi han jan juseyo)" },
        { kind: "open", prompt: "Ask how much it costs.", answer: "얼마예요? (eolmayeyo?)" },
        { kind: "open", prompt: "Order two iced americanos.", answer: "아이스 아메리카노 두 잔 주세요. (aiseu amerikano du jan juseyo)" },
        { kind: "open", prompt: "The barista asks 드시고 가세요? and you want it to go. Answer.", answer: "포장이요. (pojang-iyo)" },
        { kind: "open", prompt: "Say you'll pay by card, then thank them.", answer: "카드로 할게요. 감사합니다. (kadeuro halgeyo. gamsahamnida.)" }
      ],
      scenario: { title: "A Seoul café counter", details: "You're at the counter of a busy café in Seoul. Greet the barista, order a drink (maybe two — one iced!), answer whether it's for here or to go, ask the price, pay by card, and thank them. Use 주세요 for every request and the 잔 counter at least once." }
    }
  }
  ],
  ja: [
  {
    id: "plan-sample-es",
    language: "Spanish",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-es",
      title: "ser と estar：2つの「〜である」",
      grammar: "ser と estar",
      description: "英語の be 動詞ひとつに対して、スペイン語には動詞が2つあります。ser は「何であるか」— アイデンティティ・出身・職業・本質を表します。estar は「どんな状態か」— 感情・一時的な状態・場所を表します。混同しても意味はだいたい通じますが、この使い分けこそがスペイン語を自然に響かせる鍵です。しかも一部の形容詞は、どちらの動詞と組むかで意味そのものが変わります。",
      expanded: true,
      sections: [
        { heading: "英語の be 動詞1つ＝スペイン語の動詞2つ", body: "英語は I am a teacher / I am tired / I am in Madrid をすべて be 動詞で済ませます。スペイン語ではこの3文が2つの動詞に分かれます：Soy profesor.（職業 → ser）、Estoy cansado.（状態 → estar）、Estoy en Madrid.（場所 → estar）。どちらも不規則動詞なので、呪文のように唱えて覚えましょう。ser の現在形：soy, eres, es, somos, sois, son。estar：estoy, estás, está, estamos, estáis, están。estás と está のアクセント記号は強勢の位置を示す大切な目印です。" },
        { heading: "ser：何であるか", body: "ものごとの「本質」には ser を使います。名前・アイデンティティ：Soy Ana.（私はアナです。） 出身・国籍：Marta es de Colombia.（マルタはコロンビア出身です。）Somos mexicanos.（私たちはメキシコ人です。） 職業：Mi madre es médica.（母は医師です。） 本来の性質・外見：La casa es vieja.（その家は古い家です — 家の性格。）Pedro es alto.（ペドロは背が高い。） 所有：El libro es de Juan.（その本はフアンのものです。） 判定のコツ：「これは根本的にどういうものか？」に答える文なら ser です。" },
        { heading: "ser は時刻も伝え、パーティーも開く", body: "学習者が驚く ser の用法が2つあります。1つ目は時刻と日付：Son las tres.（3時です。）Hoy es martes.（今日は火曜日です。） 2つ目はイベント：「開催される」という意味の「ある」には、場所の話でも ser を使います。La fiesta es en mi casa.（パーティーはうちで開かれます。） 比較：Mi casa está en la calle Mayor.（私の家はマヨール通りにあります。） 物の所在は estar、イベントの開催は ser、と覚えましょう。" },
        { heading: "estar：今どんな状態か", body: "変わりうる状態には estar を使います。感情：Estoy feliz hoy.（今日は幸せです。） 体の状態：Estás cansado.（あなたは疲れています。）El café está frío.（コーヒーが冷めています。） 状況：La tienda está cerrada.（店は閉まっています。） さらに estar は進行形も作ります：Estoy estudiando español.（今スペイン語を勉強しているところです。） 記憶のフック：estar の語源はラテン語 stare「立つ」— 今どう立っているか＝現在の状態を描く動詞です。" },
        { heading: "estar：どこにあるか", body: "人や物の所在は、どんなに恒久的でも必ず estar です：Estamos en la cocina.（私たちは台所にいます。）Madrid está en España.（マドリードはスペインにあります — 永遠に動かなくても estar！） これは初級者が最も間違えやすいポイントです。「マドリードは動かないのだから本質では？」という理屈に負けないでください。位置は位置、だから estar。この規則を破るのは前のセクションのイベントだけです。" },
        { heading: "同じ形容詞でも動詞で意味が変わる", body: "動詞によって意味が切り替わる形容詞がいくつかあり、ペアで暗記する価値があります。Ana es lista.（アナは賢い。）／ Ana está lista.（アナは準備ができている。） La manzana es verde.（そのリンゴは緑色だ。）／ La manzana está verde.（そのリンゴはまだ熟していない。） Pedro es aburrido.（ペドロはつまらない人だ。）／ Pedro está aburrido.（ペドロは今退屈している。） El chico es rico.（その少年は金持ちだ。）／ La paella está rica.（このパエリアはおいしい。） 迷ったら自問しましょう：本質か、状態か？" }
      ],
      vocab: [
        { term: "ser", ipa: "seɾ", pos: "動詞", translation: "〜である（本質・アイデンティティ）", example: "Soy profesor. — 私は教師です。" },
        { term: "estar", ipa: "esˈtaɾ", pos: "動詞", translation: "〜である（状態・場所）", example: "Estoy en casa. — 私は家にいます。" },
        { term: "cansado", ipa: "kanˈsaðo", pos: "形容詞", translation: "疲れた", example: "Estás cansado hoy. — 今日は疲れていますね。" },
        { term: "listo", ipa: "ˈlisto", pos: "形容詞", translation: "賢い／準備ができた", example: "¿Estás listo? — 準備はいい？" },
        { term: "aburrido", ipa: "aβuˈriðo", pos: "形容詞", translation: "つまらない／退屈した", example: "La película es aburrida. — その映画はつまらない。" },
        { term: "frío", ipa: "ˈfɾio", pos: "形容詞", translation: "冷たい", example: "La sopa está fría. — スープが冷めています。" },
        { term: "feliz", ipa: "feˈliθ", pos: "形容詞", translation: "幸せな", example: "Estoy feliz hoy. — 今日は幸せです。" },
        { term: "cerrado", ipa: "θeˈraðo", pos: "形容詞", translation: "閉まっている", example: "La tienda está cerrada. — 店は閉まっています。" },
        { term: "verde", ipa: "ˈbeɾðe", pos: "形容詞", translation: "緑色の／未熟な", example: "La manzana está verde. — リンゴはまだ熟していません。" },
        { term: "rico", ipa: "ˈriko", pos: "形容詞", translation: "金持ちの／おいしい", example: "La paella está rica. — パエリアがおいしい。" }
      ],
      exercises: [
        { kind: "open", prompt: "ser か estar を入れましょう：\"Yo ___ de México, pero ahora ___ en Madrid.\"", answer: "soy / estoy", hint: "前半は出身、後半は場所。" },
        { kind: "open", prompt: "スペイン語に訳しましょう：「コーヒーが冷めています。」", answer: "El café está frío.", hint: "変わりうる状態です。" },
        { kind: "open", prompt: "違いを説明しましょう：\"Pedro es aburrido\" と \"Pedro está aburrido\"", answer: "ser なら「ペドロはつまらない人だ」、estar なら「ペドロは今退屈している」という意味になります。" },
        { kind: "open", prompt: "動詞を選んで理由も：\"La fiesta ___ en el restaurante.\"", answer: "es — イベントの開催は場所の話でも ser を使います。", hint: "どこかに置いてある物？ それとも起こる出来事？" },
        { kind: "open", prompt: "スペイン語に訳しましょう：「母は医師で、今日は疲れています。」", answer: "Mi madre es médica y hoy está cansada." }
      ],
      scenario: { title: "友達の家族との夕食", details: "スペイン人の友達の家族の夕食に招かれました。自己紹介をしましょう — 自分が誰か、どこの出身か、仕事は何か、旅のあとの気分はどうか。家族のことも尋ねながら、ser と estar を正しく選んで話します。ボーナス課題：estar rico を使って料理を褒めましょう。" }
    }
  },
  {
    id: "plan-sample-en",
    language: "English",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-en",
      title: "カフェで注文：Could I have ...?",
      grammar: "Could I have ...? での丁寧な依頼",
      description: "英語圏のカフェやレストランでは、このパターンひとつで乗り切れます：Could I have [欲しいもの], please?「〜をいただけますか？」 このレッスンではカフェでの一連の流れをすべて組み立てます — 飲み物の注文、サイズと数の伝え方、カスタマイズ、支払い、お礼まで。終わる頃には、ロンドンでもニューヨークでも、落ち着いて欲しいものを注文できるようになります。",
      expanded: true,
      sections: [
        { heading: "丁寧な注文の万能フレーズ", body: "英語の依頼表現はたくさんありますが、カフェで一番安全で自然なのが Could I have ...please? です。Could I have a coffee, please?（コーヒーをひとついただけますか？） could は can の過去形ではなく、ここでは「丁寧さのマーカー」。店員にも、初対面の人にも、どんな場面でも失礼になりません。文末の please を忘れずに — 英語圏では please のない依頼はかなりぶっきらぼうに聞こえます。この1文を体に染み込ませれば、注文の8割は解決です。" },
        { heading: "カジュアルな言い方も知っておく", body: "ネイティブの注文をよく聞くと、いろいろなバリエーションがあります。Can I get a latte?（ラテもらえますか？）はアメリカのカフェで非常によく聞くカジュアル形。I'll have an orange juice, please.（オレンジジュースをお願いします）はレストランで定番。一番シンプルなのは商品名 + please：A tea, please. どれも通じますが、迷ったら Could I have ...? に戻れば間違いありません。聞き取りのコツ：店員の What can I get you?（何になさいますか？）が注文開始の合図です。" },
        { heading: "サイズと数", body: "多くのカフェではサイズを聞かれます：small / medium / large。注文にそのまま組み込めます：Could I have a large latte, please?（ラージのラテをください。） 2つ以上頼むときは名詞を複数形に：two coffees, three teas。英語では a coffee（1杯のコーヒー）のように、本来数えられない名詞もカフェでは「1杯」として数えます。Could I have two coffees and a water, please? — これで同僚の分まで一度に注文できます。" },
        { heading: "カスタマイズ：with / without", body: "細かい注文は with / without で伝えます：with milk（ミルク入り）、without sugar（砂糖なし）、with an extra shot（ショット追加）。Could I have a coffee with milk, please? 温度は iced / hot を名前の前に：an iced latte、a hot chocolate。決められないときは What do you recommend?（おすすめは何ですか？）と聞いてしまうのも立派な会話練習です。店員の答えを聞き取って、そのまま Could I have that, please?（それをください）と返せば完璧。" },
        { heading: "支払い：How much is it?", body: "値段を聞くには How much is it?（いくらですか？） 複数頼んだなら How much is it all together?（全部でいくらですか？） 店員からの定番の質問も準備しておきましょう：For here or to go?（店内ですか、お持ち帰りですか？）— イギリスでは Eat in or take away? と言います。答えは For here, please. / To go, please. カードで払うなら Can I pay by card? ですが、たいていは端末にタッチするだけで言葉は不要です。" },
        { heading: "受け取りとお礼、そしてスモールトーク", body: "注文が完成すると名前や番号で呼ばれます：A large latte for Ken!（ケンさんのラージラテ！） 受け取ったら Thank you! / Thanks so much! と笑顔で。英語圏のカフェでは店員との軽い雑談も日常です：How's your day going?（今日はどう？）と聞かれたら Good, thanks. How about you? と返せば満点。この一往復ができると、注文が「タスク」から「会話」に変わります。次のロールプレイでぜひ試してみましょう。" }
      ],
      vocab: [
        { term: "coffee", ipa: "ˈkɒfi", pos: "名詞", translation: "コーヒー", example: "Could I have a coffee, please? — コーヒーをいただけますか？" },
        { term: "water", ipa: "ˈwɔːtə", pos: "名詞", translation: "水", example: "Could I have some water, please? — お水をいただけますか？" },
        { term: "please", ipa: "pliːz", pos: "副詞", translation: "〜をお願いします", example: "A tea, please. — 紅茶をお願いします。" },
        { term: "Could I have ...?", ipa: "kʊd aɪ hæv", pos: "フレーズ", translation: "〜をいただけますか？", example: "Could I have a latte, please? — ラテをいただけますか？" },
        { term: "large", ipa: "lɑːdʒ", pos: "形容詞", translation: "ラージの、大きい", example: "A large coffee, please. — ラージコーヒーをお願いします。" },
        { term: "with milk", ipa: "wɪð mɪlk", pos: "フレーズ", translation: "ミルク入りで", example: "Coffee with milk, please. — ミルク入りコーヒーをお願いします。" },
        { term: "How much is it?", ipa: "haʊ mʌtʃ ɪz ɪt", pos: "フレーズ", translation: "いくらですか？", example: "How much is it all together? — 全部でいくらですか？" },
        { term: "to go", ipa: "tə ɡəʊ", pos: "フレーズ", translation: "持ち帰りで", example: "A coffee to go, please. — コーヒーを持ち帰りでお願いします。" },
        { term: "For here or to go?", ipa: "fə hɪə ɔː tə ɡəʊ", pos: "フレーズ", translation: "店内ですか、お持ち帰りですか？", example: "For here, please. — 店内でお願いします。" },
        { term: "Thank you", ipa: "θæŋk juː", pos: "フレーズ", translation: "ありがとうございます", example: "Thanks so much! — 本当にありがとう！" }
      ],
      exercises: [
        { kind: "open", prompt: "コーヒーを1つ、丁寧に注文しましょう。", answer: "Could I have a coffee, please?" },
        { kind: "open", prompt: "値段を尋ねましょう。", answer: "How much is it?" },
        { kind: "open", prompt: "ラテを2つ、持ち帰りで注文しましょう。", answer: "Could I have two lattes to go, please?" },
        { kind: "open", prompt: "店員に For here or to go? と聞かれました。店内で飲む場合の答えは？", answer: "For here, please." },
        { kind: "open", prompt: "ミルク入り・砂糖なしのラージコーヒーを注文しましょう。", answer: "Could I have a large coffee with milk and without sugar, please?" }
      ],
      scenario: { title: "ロンドンのカフェ", details: "ロンドンの混み合うカフェにいます。店員に挨拶して、飲み物を注文し、サイズとカスタマイズを伝え、値段を聞いて、店内か持ち帰りかを答え、お礼を言いましょう。依頼には必ず Could I have ...? を使うこと。余裕があれば店員のスモールトークにも返事をしてみましょう。" }
    }
  },
  {
    id: "plan-sample-ko",
    language: "Korean",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-ko",
      title: "カフェで注文：주세요",
      grammar: "주세요を使った丁寧な依頼",
      description: "韓国のカフェ・食堂・市場・コンビニは、このパターンひとつで乗り切れます：[欲しいもの] 주세요（ジュセヨ）「〜をください」。このレッスンではカフェでの一連の流れを組み立てます — 飲み物の指定、韓国式の数え方、値段の聞き方、支払い、お礼まで。終わる頃には、ソウルのカウンターで欲しいものを丁寧に注文できるようになります。",
      expanded: true,
      sections: [
        { heading: "どのカウンターでも通じる万能パターン", body: "韓国語には敬語のレベルがいくつもあり、初級者はどれを使うべきか迷いがちです。朗報：買い物と注文なら 주세요（ジュセヨ）が常に安全です。文字どおりには「（私に）ください」という意味で、標準的な丁寧体（해요체）に属します。バリスタにも店主にも失礼にならず、堅苦しすぎることもありません。韓国では老若男女がまさにこの形をあらゆるカウンターで使っています。この一語をマスターすれば、どこでも用が足せます。" },
        { heading: "パターン：[もの] + 주세요", body: "欲しいものを 주세요 の直前に置くだけです：커피 주세요（コピ ジュセヨ）「コーヒーをください」。물 주세요（ムル ジュセヨ）「お水をください」。이거 주세요（イゴ ジュセヨ）「これをください」— 単語が分からないときの万能の逃げ道で、指さしながら言えばOK。英語や日本語と比べて「〜していただけますか」にあたる部分がないのがポイント：丁寧さは語尾の -세요 に含まれているので、文は短いまま完全に礼儀正しいのです。" },
        { heading: "飲み物の数え方：固有数詞 + 잔", body: "韓国語は「固有数詞＋助数詞」で物を数えます。飲み物の助数詞は 잔（ジャン）「杯」：한 잔（ハン ジャン）1杯、두 잔（トゥ ジャン）2杯、세 잔（セ ジャン）3杯、네 잔（ネ ジャン）4杯。語順は「もの＋数＋助数詞＋주세요」：아메리카노 두 잔 주세요（アメリカノ トゥ ジャン ジュセヨ）「アメリカーノを2杯ください」。数詞が名詞の後ろに来る点に注意 — 日本語の「アメリカーノ2杯ください」と同じ順序なので、日本語話者にはむしろ自然です。初日は助数詞を省いて指2本でも通じますが、잔 が言えると一気に「慣れている人」に聞こえます。" },
        { heading: "アイス・ホット・メニューの読み方", body: "韓国のカフェメニューは意外と読みやすいもの。飲み物の名前の多くはハングル表記の英語だからです：아메리카노（アメリカノ）、라떼（ラテ）、주스（ジュス、ジュース）。温度は名前の前に置きます：아이스（アイス）「アイスの」— 아이스 아메리카노 주세요。ホットなら 따뜻한（タットゥタン）「温かい」：따뜻한 라떼 주세요。韓国のアイスコーヒー愛は本物で、真冬の1月でもアイスアメリカーノが定番。どちらを頼んでも浮くことはありません。" },
        { heading: "支払い：얼마예요? とカード文化", body: "値段を聞くには 얼마예요?（オルマエヨ）「いくらですか？」 価格はウォンで、聞こえてくるのはほぼ「千」単位：사천 원（サチョン ウォン）は4,000ウォン。大きな数字に焦らなくて大丈夫 — レジには必ず合計が表示されるので、耳で聞く値段は「補助輪つきのリスニング練習」だと思いましょう。韓国は世界有数のカード社会：카드로 할게요（カドゥロ ハルケヨ）「カードで払います」と言ってタッチすれば終わりです。現金も使えますが、期待されていません。" },
        { heading: "店内か持ち帰りか、そしてお礼", body: "注文のあと、定番の質問が来ます：드시고 가세요?（トゥシゴ カセヨ）「店内でお召し上がりですか？」 店内なら 네（ネ）「はい」、持ち帰りなら 포장이요（ポジャンイヨ）「持ち帰りでお願いします」。飲み物がカウンターに置かれたら 감사합니다（カムサハムニダ）「ありがとうございます」— どこでも通用するフルバージョンの丁寧形です。店員同士では少し柔らかい 감사해요（カムサヘヨ）も聞こえてくるでしょう。受け取って軽く会釈すれば、韓国語だけで取引をひとつ完了です。" }
      ],
      vocab: [
        { term: "커피", ipa: "kʰʌpʰi", pos: "名詞", translation: "コーヒー", example: "커피 주세요. (keopi juseyo) — コーヒーをください。" },
        { term: "물", ipa: "mul", pos: "名詞", translation: "水", example: "물 주세요. (mul juseyo) — お水をください。" },
        { term: "아메리카노", ipa: "amerikʰano", pos: "名詞", translation: "アメリカーノ", example: "아메리카노 두 잔 주세요. — アメリカーノを2杯ください。" },
        { term: "주세요", ipa: "tɕusejo", pos: "動詞（丁寧形）", translation: "〜をください", example: "이거 주세요. (igeo juseyo) — これをください。" },
        { term: "잔", ipa: "tɕan", pos: "助数詞", translation: "杯", example: "두 잔 (du jan) — 2杯" },
        { term: "아이스", ipa: "aisɯ", pos: "名詞", translation: "アイスの", example: "아이스 아메리카노 주세요. — アイスアメリカーノをください。" },
        { term: "얼마예요", ipa: "ʌlmajejo", pos: "フレーズ", translation: "いくらですか？", example: "이거 얼마예요? (igeo eolmayeyo) — これはいくらですか？" },
        { term: "카드", ipa: "kʰadɯ", pos: "名詞", translation: "カード", example: "카드로 할게요. (kadeuro halgeyo) — カードで払います。" },
        { term: "포장", ipa: "pʰodʑaŋ", pos: "名詞", translation: "持ち帰り", example: "포장이요. (pojang-iyo) — 持ち帰りでお願いします。" },
        { term: "감사합니다", ipa: "kamsahamnida", pos: "フレーズ", translation: "ありがとうございます", example: "감사합니다! (gamsahamnida) — ありがとうございます！" }
      ],
      exercises: [
        { kind: "open", prompt: "コーヒーを1杯、丁寧に注文しましょう。", answer: "커피 (한 잔) 주세요. (keopi han jan juseyo)" },
        { kind: "open", prompt: "値段を尋ねましょう。", answer: "얼마예요? (eolmayeyo?)" },
        { kind: "open", prompt: "アイスアメリカーノを2杯注文しましょう。", answer: "아이스 아메리카노 두 잔 주세요. (aiseu amerikano du jan juseyo)" },
        { kind: "open", prompt: "店員に 드시고 가세요? と聞かれました。持ち帰りたいときの答えは？", answer: "포장이요. (pojang-iyo)" },
        { kind: "open", prompt: "カードで払うと伝えてから、お礼を言いましょう。", answer: "카드로 할게요. 감사합니다. (kadeuro halgeyo. gamsahamnida.)" }
      ],
      scenario: { title: "ソウルのカフェカウンター", details: "ソウルの混み合うカフェのカウンターにいます。店員に挨拶して、飲み物を注文し（2杯でも！1杯はアイスで）、店内か持ち帰りかを答え、値段を聞いて、カードで払い、お礼を言いましょう。依頼には必ず 주세요 を、そして助数詞 잔 を最低1回使うこと。" }
    }
  }
  ],
  "zh-Hant": [
  {
    id: "plan-sample-es",
    language: "Spanish",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-es",
      title: "ser 與 estar：兩種「是」",
      grammar: "ser 與 estar",
      description: "英語只有一個 be 動詞，西班牙語卻有兩個。ser 表示某物「是什麼」——身分、出身、職業、本質；estar 表示「處於什麼狀態」——感受、暫時狀況、位置。混用通常不影響溝通，但掌握這個區別正是讓西班牙語聽起來道地的關鍵，而且有一批形容詞會因為搭配的動詞不同而改變意思。",
      expanded: true,
      sections: [
        { heading: "一個英語 be，兩個西語動詞", body: "英語把一切都塞進 to be：I am a teacher、I am tired、I am in Madrid。西班牙語把這三句拆給兩個動詞：Soy profesor.（職業 → ser）、Estoy cansado.（狀態 → estar）、Estoy en Madrid.（位置 → estar）。兩個動詞都不規則，當口訣背下來吧。ser 的現在式：soy, eres, es, somos, sois, son。estar：estoy, estás, está, estamos, estáis, están。注意 estás 和 está 的重音符號——它們標示重讀音節，書寫時不可省略。" },
        { heading: "ser：是什麼", body: "事物的「本質」用 ser。身分與名字：Soy Ana.（我是 Ana。） 出身與國籍：Marta es de Colombia.（Marta 來自哥倫比亞。）Somos mexicanos.（我們是墨西哥人。） 職業：Mi madre es médica.（我媽媽是醫生。） 本質特徵與外貌：La casa es vieja.（那房子是老房子——它的本性。）Pedro es alto.（Pedro 個子高。） 所屬：El libro es de Juan.（這本書是 Juan 的。） 判斷訣竅：句子回答的是「這東西骨子裡是什麼」，就用 ser。" },
        { heading: "ser 還報時間——也主辦派對", body: "ser 有兩個讓學習者意外的用法。第一，鐘點與日期一律用 ser：Son las tres.（三點了。）Hoy es martes.（今天星期二。） 第二，活動：當「在」的意思是「舉行」時，即使講地點也用 ser。La fiesta es en mi casa.（派對在我家舉行。） 對比：Mi casa está en la calle Mayor.（我家位於 Mayor 街。） 記住：東西的位置用 estar，活動的舉行用 ser。" },
        { heading: "estar：現在是什麼狀態", body: "可能改變的狀況用 estar。感受：Estoy feliz hoy.（我今天很開心。） 身體狀態：Estás cansado.（你累了。）El café está frío.(咖啡涼了。) 情況：La tienda está cerrada.（店關門了。） estar 還構成進行式：Estoy estudiando español.（我正在學西班牙語。） 記憶鉤子：estar 源自拉丁語 stare「站立」——它描述事物此刻「站在什麼狀態」。" },
        { heading: "estar：在哪裡", body: "人和物的位置一律用 estar，無論多麼永久：Estamos en la cocina.（我們在廚房。）Madrid está en España.（馬德里在西班牙——永遠不會動，仍然用 estar！） 這是初學者最常犯的 ser/estar 錯誤，因為「馬德里不會移動」讓位置感覺像本質。別被邏輯騙了：位置就是位置，一律 estar。唯一的例外是上一節的「活動」。" },
        { heading: "同一個形容詞，不同的意思", body: "一小批形容詞會隨動詞切換意思，值得成對背下來。Ana es lista.（Ana 很聰明。）／ Ana está lista.（Ana 準備好了。） La manzana es verde.（蘋果是綠色的。）／ La manzana está verde.（蘋果還沒熟。） Pedro es aburrido.（Pedro 是個無趣的人。）／ Pedro está aburrido.（Pedro 現在覺得無聊。） El chico es rico.（那男孩很有錢。）／ La paella está rica.（這鍋海鮮飯很好吃。） 猶豫時問自己：本質，還是狀態？" }
      ],
      vocab: [
        { term: "ser", ipa: "seɾ", pos: "動詞", translation: "是（本質、身分）", example: "Soy profesor. — 我是老師。" },
        { term: "estar", ipa: "esˈtaɾ", pos: "動詞", translation: "是（狀態、位置）", example: "Estoy en casa. — 我在家。" },
        { term: "cansado", ipa: "kanˈsaðo", pos: "形容詞", translation: "累的", example: "Estás cansado hoy. — 你今天累了。" },
        { term: "listo", ipa: "ˈlisto", pos: "形容詞", translation: "聰明的／準備好的", example: "¿Estás listo? — 你準備好了嗎？" },
        { term: "aburrido", ipa: "aβuˈriðo", pos: "形容詞", translation: "無聊的／感到無聊的", example: "La película es aburrida. — 這部電影很無聊。" },
        { term: "frío", ipa: "ˈfɾio", pos: "形容詞", translation: "冷的", example: "La sopa está fría. — 湯涼了。" },
        { term: "feliz", ipa: "feˈliθ", pos: "形容詞", translation: "開心的", example: "Estoy feliz hoy. — 我今天很開心。" },
        { term: "cerrado", ipa: "θeˈraðo", pos: "形容詞", translation: "關閉的", example: "La tienda está cerrada. — 店關門了。" },
        { term: "verde", ipa: "ˈbeɾðe", pos: "形容詞", translation: "綠色的／未熟的", example: "La manzana está verde. — 蘋果還沒熟。" },
        { term: "rico", ipa: "ˈriko", pos: "形容詞", translation: "有錢的／美味的", example: "La paella está rica. — 海鮮飯很好吃。" }
      ],
      exercises: [
        { kind: "open", prompt: "填入 ser 或 estar：\"Yo ___ de México, pero ahora ___ en Madrid.\"", answer: "soy / estoy", hint: "前面是出身，後面是位置。" },
        { kind: "open", prompt: "翻譯：「咖啡涼了。」", answer: "El café está frío.", hint: "會改變的狀態。" },
        { kind: "open", prompt: "說明差異：\"Pedro es aburrido\" 和 \"Pedro está aburrido\"", answer: "用 ser 表示 Pedro 是個無趣的人；用 estar 表示 Pedro 現在覺得無聊。" },
        { kind: "open", prompt: "選動詞並說明理由：\"La fiesta ___ en el restaurante.\"", answer: "es — 活動的舉行即使講地點也用 ser。", hint: "是放在某處的東西，還是發生的事件？" },
        { kind: "open", prompt: "翻譯：「我媽媽是醫生，今天她累了。」", answer: "Mi madre es médica y hoy está cansada." }
      ],
      scenario: { title: "認識朋友的家人", details: "你來到西班牙朋友家的家庭聚餐。自我介紹——你是誰、來自哪裡、做什麼工作、旅途後感覺如何——並問候家人，一路正確選用 ser 和 estar。加分題：用 estar rico 稱讚菜好吃。" }
    }
  },
  {
    id: "plan-sample-ja",
    language: "Japanese",
    level: "Absolute beginner",
    lesson: {
      id: "lesson-sample-ja",
      title: "平假名：最初的十個字",
      grammar: "平假名 あ～こ",
      description: "日語混用三套書寫系統，而平假名是其他一切的地基：它是音節文字，一字恰好一音，用來書寫語法、固有詞，以及拼出任何其他內容。本課學習前兩行——五個母音和 か 行。十個字已經足以讀出真正的日語單字，而且這裡學到的規律會在整套字母表中不斷重複。",
      expanded: true,
      alphabet: [
        { character: "あ", romanization: "a", ipa: "a", group: "母音", note: "類似「啊」的音。" },
        { character: "い", romanization: "i", ipa: "i", group: "母音", note: "短促的「衣」。" },
        { character: "う", romanization: "u", ipa: "ɯ", group: "母音", note: "嘴唇放鬆、不圓唇的「烏」。" },
        { character: "え", romanization: "e", ipa: "e", group: "母音", note: "類似「欸」。" },
        { character: "お", romanization: "o", ipa: "o", group: "母音", note: "乾淨的「喔」，結尾不滑音。" },
        { character: "か", romanization: "ka", ipa: "ka", group: "か行", note: "k + a" },
        { character: "き", romanization: "ki", ipa: "ki", group: "か行", note: "k + i" },
        { character: "く", romanization: "ku", ipa: "kɯ", group: "か行", note: "k + u" },
        { character: "け", romanization: "ke", ipa: "ke", group: "か行", note: "k + e" },
        { character: "こ", romanization: "ko", ipa: "ko", group: "か行", note: "k + o" }
      ],
      sections: [
        { heading: "日語的三套文字——為什麼先學平假名", body: "書面日語交織著三套系統。漢字借自中文、承載意義（日「太陽」、語「語言」）——對中文使用者來說是一大優勢，很多字你已經認得！片假名拼寫外來語（コーヒー kōhī，「咖啡」）。平假名則是主力：它書寫動詞詞尾、助詞和固有詞，還能拼出任何你不會寫漢字的內容。童書全用平假名寫成；漫畫和課本裡印在漢字上方的小小注音——振假名——也是平假名。先學會它，整個語言就此打開。" },
        { heading: "一字一拍", body: "平假名是音節文字，不是字母：每個字是一個「拍」（mora），一個等長的音。あい（ai）「愛」是兩拍：a-i，長度相等。沒有不發音的字母，沒有拼寫陷阱——看到什麼就讀什麼，每一次都一樣。日語的節奏像節拍器一樣均勻前進，給每個字完整的一拍，就是自然口音的一半祕訣。把本課每個單字大聲讀出來，邊讀邊在桌上打拍子。" },
        { heading: "五個母音：あ い う え お", body: "日語的所有聲音都建立在五個母音上，發音永遠不變。あ（a）如「啊」。い（i）如「衣」，短促。う（u）最特別：嘴唇放鬆、完全不圓唇，和中文的「烏」不同。え（e）如「欸」。お（o）是乾淨純粹的「喔」，結尾沒有「w」滑音。這五個字開啟你將見到的每一張五十音圖，而它們的順序——a、i、u、e、o——就是日語辭典的排序方式。" },
        { heading: "加上子音：か行", body: "最美妙的部分來了：其餘的平假名都是同樣五個母音配上不同子音，順序永遠不變。加上 k 就得到 か(ka)、き(ki)、く(ku)、け(ke)、こ(ko)。就這樣——你已經理解整張圖表的結構了。之後每一行的成本都極低：學一個子音，重用五個母音。再偷看一眼這套系統能走多遠：兩個小點（濁點）讓子音濁化，か(ka) 變成 が(ga)。一個規律，無限重用。" },
        { heading: "你的第一批真單字", body: "十個字就能讀出貨真價實的日語：あい（ai）「愛」、いえ（ie）「家」、うえ（ue）「上面」、えき（eki）「車站」、かお（kao）「臉」、こえ（koe）「聲音」、あき（aki）「秋天」、かき（kaki）「柿子」、あお（ao）「藍色」。每個字先慢慢讀，一字一拍，再用自然速度讀一遍。重複的母音就是兩拍：ああ（ā）讀成拉長兩倍的「啊」。這就是日語拼寫友善的原因——讀和寫永遠不會脫節。" },
        { heading: "怎麼練習", body: "每個字寫十遍，邊寫邊大聲唸出它的音——手、眼、耳互相強化。照著圖表的筆順寫（由上到下、由左到右）；看似囉嗦，卻能讓你的字跡清楚又快速，而且所有字帖都以它為前提。接著遮住單字表的羅馬拼音欄，只靠平假名讀出單字。當 あき 不再是「一道謎題」而直接是秋天時，這些字就住進長期記憶了。每天十分鐘，勝過每週一小時。" }
      ],
      vocab: [
        { term: "あい", ipa: "ai", pos: "名詞", translation: "愛", example: "あい (ai) — 愛" },
        { term: "いえ", ipa: "ie", pos: "名詞", translation: "家", example: "いえ (ie) — 家" },
        { term: "うえ", ipa: "ɯe", pos: "名詞", translation: "上面", example: "うえ (ue) — 上面" },
        { term: "えき", ipa: "eki", pos: "名詞", translation: "車站", example: "えき (eki) — 車站" },
        { term: "かお", ipa: "kao", pos: "名詞", translation: "臉", example: "かお (kao) — 臉" },
        { term: "こえ", ipa: "koe", pos: "名詞", translation: "聲音", example: "こえ (koe) — 聲音" },
        { term: "あき", ipa: "aki", pos: "名詞", translation: "秋天", example: "あき (aki) — 秋天" },
        { term: "あお", ipa: "ao", pos: "名詞", translation: "藍色", example: "あお (ao) — 藍色" }
      ],
      exercises: [
        { kind: "open", prompt: "寫出羅馬拼音：あき", answer: "aki（秋天）" },
        { kind: "open", prompt: "用平假名寫出：k-o-e（聲音）", answer: "こえ" },
        { kind: "open", prompt: "哪個字是「ku」？", answer: "く" },
        { kind: "open", prompt: "讀出並給出意思：いえ", answer: "ie — 家" },
        { kind: "open", prompt: "用平假名拼出「kaki」（柿子），並說出它有幾拍。", answer: "かき — 兩拍（ka-ki）。" }
      ],
      scenario: { title: "平假名閱讀遊戲", details: "導師出示只用 あ～こ 寫成的短單字。用羅馬拼音大聲讀出，再猜猜意思。卡住時導師會給友善的提示，你上手後會逐漸加速。也請導師反向出題——聽羅馬拼音寫平假名。" }
    }
  },
  {
    id: "plan-sample-ko",
    language: "Korean",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-ko",
      title: "咖啡店點餐：주세요",
      grammar: "用 주세요 提出禮貌請求",
      description: "一個句型就能搞定韓國所有咖啡店、餐廳、市場攤位和便利商店：[想要的東西] 주세요（juseyo）「請給我……」。本課圍繞它組織整趟咖啡店之旅：說出飲料名稱、用韓國方式數杯數、問價錢、付款、道謝。學完之後，你就能走到首爾任何一個櫃檯，禮貌地買到你想要的東西。",
      expanded: true,
      sections: [
        { heading: "一個句型走遍所有櫃檯", body: "韓語有好幾個敬語等級，初學者常常不知道該用哪一個。好消息：購物和點餐時，주세요（juseyo）永遠安全。它的字面意思是「請給（我）」，屬於標準的禮貌體（해요체）。任何咖啡師、店主或服務生都不會覺得它失禮，也不會覺得太過生硬。在韓國，各個年齡層的人都在各種櫃檯用的正是這個形式。掌握這一個詞，你就能在任何地方完成交易。" },
        { heading: "句型：[東西] + 주세요", body: "把你想要的東西直接放在 주세요 前面：커피 주세요（keopi juseyo）「請給我咖啡」。물 주세요（mul juseyo）「請給我水」。이거 주세요（igeo juseyo）「請給我這個」——不會說某個詞時的萬用逃生口：用手一指，說出口就行。留意它和中文的差別：不需要「可以給我……嗎」這類包裝。韓語把禮貌打包進動詞詞尾 -세요 裡，句子保持簡短，同時完全客氣。" },
        { heading: "數飲料：固有數詞 + 잔", body: "韓語用「固有數詞＋量詞」數東西。飲料的量詞是 잔（jan）「杯」：한 잔（han jan）一杯、두 잔（du jan）兩杯、세 잔（se jan）三杯、네 잔（ne jan）四杯。語序是「東西＋數字＋量詞＋주세요」：아메리카노 두 잔 주세요「請給我兩杯美式」。注意數字在名詞後面——和中文的「美式兩杯」語感相近，不難適應。第一天覺得量詞太多？可以省略，說 아메리카노 주세요 再比出兩根手指也行。但用上 잔 會立刻讓你聽起來像常客。" },
        { heading: "冰的、熱的、看懂菜單", body: "韓國咖啡店的菜單意外地好讀，因為大多數飲料名是用韓文字母拼寫的英語：아메리카노（americano）、라떼（latte）、주스（juseu，果汁）。溫度放在名字前面：아이스（aiseu）「冰的」——아이스 아메리카노 주세요。熱飲會聽到 따뜻한（ttatteuthan）「溫熱的」：따뜻한 라떼 주세요。韓國人對冰美式的熱愛是認真的——就算一月寒冬也照喝不誤，所以你點哪種都不會突兀。" },
        { heading: "付款：얼마예요? 與刷卡文化", body: "問價錢說 얼마예요?（eolmayeyo?）「多少錢？」 價格以韓元計，你聽到的多半是「千」：사천 원（sacheon won）是 4,000 韓元。別被大數字嚇到——收銀機一定會顯示總額，把聽到的價錢當成「有輔助輪的聽力練習」就好。韓國是全球數一數二的刷卡社會：說 카드로 할게요（kadeuro halgeyo）「我用卡付」，一嗶就完成。現金也收，但沒人預期你用現金。" },
        { heading: "內用、外帶，然後道謝", body: "點完餐，經典的追問來了：드시고 가세요?（deusigo gaseyo?）「內用嗎？」 留下喝答 네（ne）「是」，外帶答 포장이요（pojang-iyo）「外帶，麻煩了」。飲料放上櫃檯時說 감사합니다（gamsahamnida）「謝謝」——最完整、最保險、到哪都通用的正式版。你也會聽到店員之間用稍微柔和的 감사해요（gamsahaeyo）。接過飲料、點個頭，恭喜：你剛用韓語完成了一整筆交易。" }
      ],
      vocab: [
        { term: "커피", ipa: "kʰʌpʰi", pos: "名詞", translation: "咖啡", example: "커피 주세요. (keopi juseyo) — 請給我咖啡。" },
        { term: "물", ipa: "mul", pos: "名詞", translation: "水", example: "물 주세요. (mul juseyo) — 請給我水。" },
        { term: "아메리카노", ipa: "amerikʰano", pos: "名詞", translation: "美式咖啡", example: "아메리카노 두 잔 주세요. — 請給我兩杯美式。" },
        { term: "주세요", ipa: "tɕusejo", pos: "動詞（禮貌形）", translation: "請給我", example: "이거 주세요. (igeo juseyo) — 請給我這個。" },
        { term: "잔", ipa: "tɕan", pos: "量詞", translation: "杯", example: "두 잔 (du jan) — 兩杯" },
        { term: "아이스", ipa: "aisɯ", pos: "名詞", translation: "冰的", example: "아이스 아메리카노 주세요. — 請給我冰美式。" },
        { term: "얼마예요", ipa: "ʌlmajejo", pos: "短語", translation: "多少錢？", example: "이거 얼마예요? (igeo eolmayeyo) — 這個多少錢？" },
        { term: "카드", ipa: "kʰadɯ", pos: "名詞", translation: "卡片", example: "카드로 할게요. (kadeuro halgeyo) — 我用卡付。" },
        { term: "포장", ipa: "pʰodʑaŋ", pos: "名詞", translation: "外帶", example: "포장이요. (pojang-iyo) — 外帶，麻煩了。" },
        { term: "감사합니다", ipa: "kamsahamnida", pos: "短語", translation: "謝謝", example: "감사합니다! (gamsahamnida) — 謝謝！" }
      ],
      exercises: [
        { kind: "open", prompt: "禮貌地點一杯咖啡。", answer: "커피 (한 잔) 주세요. (keopi han jan juseyo)" },
        { kind: "open", prompt: "問價錢。", answer: "얼마예요? (eolmayeyo?)" },
        { kind: "open", prompt: "點兩杯冰美式。", answer: "아이스 아메리카노 두 잔 주세요. (aiseu amerikano du jan juseyo)" },
        { kind: "open", prompt: "店員問 드시고 가세요? 而你想外帶。怎麼回答？", answer: "포장이요. (pojang-iyo)" },
        { kind: "open", prompt: "說你要刷卡，然後道謝。", answer: "카드로 할게요. 감사합니다. (kadeuro halgeyo. gamsahamnida.)" }
      ],
      scenario: { title: "首爾咖啡店櫃檯", details: "你在首爾一家熱鬧咖啡店的櫃檯。跟店員打招呼、點飲料（點兩杯也行——其中一杯冰的！）、回答內用或外帶、問價錢、刷卡付款、道謝。每個請求都用 주세요，量詞 잔 至少用一次。" }
    }
  }
  ],
  "zh-Hans": [
  {
    id: "plan-sample-es",
    language: "Spanish",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-es",
      title: "ser 与 estar：两种“是”",
      grammar: "ser 与 estar",
      description: "英语只有一个 be 动词，西班牙语却有两个。ser 表示某物“是什么”——身份、出身、职业、本质；estar 表示“处于什么状态”——感受、暂时状况、位置。混用通常不影响沟通，但掌握这个区别正是让西班牙语听起来地道的关键，而且有一批形容词会因为搭配的动词不同而改变意思。",
      expanded: true,
      sections: [
        { heading: "一个英语 be，两个西语动词", body: "英语把一切都塞进 to be：I am a teacher、I am tired、I am in Madrid。西班牙语把这三句拆给两个动词：Soy profesor.（职业 → ser）、Estoy cansado.（状态 → estar）、Estoy en Madrid.（位置 → estar）。两个动词都不规则，当口诀背下来吧。ser 的现在时：soy, eres, es, somos, sois, son。estar：estoy, estás, está, estamos, estáis, están。注意 estás 和 está 的重音符号——它们标示重读音节，书写时不可省略。" },
        { heading: "ser：是什么", body: "事物的“本质”用 ser。身份与名字：Soy Ana.（我是 Ana。） 出身与国籍：Marta es de Colombia.（Marta 来自哥伦比亚。）Somos mexicanos.（我们是墨西哥人。） 职业：Mi madre es médica.（我妈妈是医生。） 本质特征与外貌：La casa es vieja.（那房子是老房子——它的本性。）Pedro es alto.（Pedro 个子高。） 所属：El libro es de Juan.（这本书是 Juan 的。） 判断诀窍：句子回答的是“这东西骨子里是什么”，就用 ser。" },
        { heading: "ser 还报时间——也主办派对", body: "ser 有两个让学习者意外的用法。第一，钟点与日期一律用 ser：Son las tres.（三点了。）Hoy es martes.（今天星期二。） 第二，活动：当“在”的意思是“举行”时，即使讲地点也用 ser。La fiesta es en mi casa.（派对在我家举行。） 对比：Mi casa está en la calle Mayor.（我家位于 Mayor 街。） 记住：东西的位置用 estar，活动的举行用 ser。" },
        { heading: "estar：现在是什么状态", body: "可能改变的状况用 estar。感受：Estoy feliz hoy.（我今天很开心。） 身体状态：Estás cansado.（你累了。）El café está frío.（咖啡凉了。） 情况：La tienda está cerrada.（店关门了。） estar 还构成进行时：Estoy estudiando español.（我正在学西班牙语。） 记忆钩子：estar 源自拉丁语 stare“站立”——它描述事物此刻“站在什么状态”。" },
        { heading: "estar：在哪里", body: "人和物的位置一律用 estar，无论多么永久：Estamos en la cocina.（我们在厨房。）Madrid está en España.（马德里在西班牙——永远不会动，仍然用 estar！） 这是初学者最常犯的 ser/estar 错误，因为“马德里不会移动”让位置感觉像本质。别被逻辑骗了：位置就是位置，一律 estar。唯一的例外是上一节的“活动”。" },
        { heading: "同一个形容词，不同的意思", body: "一小批形容词会随动词切换意思，值得成对背下来。Ana es lista.（Ana 很聪明。）／ Ana está lista.（Ana 准备好了。） La manzana es verde.（苹果是绿色的。）／ La manzana está verde.（苹果还没熟。） Pedro es aburrido.（Pedro 是个无趣的人。）／ Pedro está aburrido.（Pedro 现在觉得无聊。） El chico es rico.（那男孩很有钱。）／ La paella está rica.（这锅海鲜饭很好吃。） 犹豫时问自己：本质，还是状态？" }
      ],
      vocab: [
        { term: "ser", ipa: "seɾ", pos: "动词", translation: "是（本质、身份）", example: "Soy profesor. — 我是老师。" },
        { term: "estar", ipa: "esˈtaɾ", pos: "动词", translation: "是（状态、位置）", example: "Estoy en casa. — 我在家。" },
        { term: "cansado", ipa: "kanˈsaðo", pos: "形容词", translation: "累的", example: "Estás cansado hoy. — 你今天累了。" },
        { term: "listo", ipa: "ˈlisto", pos: "形容词", translation: "聪明的／准备好的", example: "¿Estás listo? — 你准备好了吗？" },
        { term: "aburrido", ipa: "aβuˈriðo", pos: "形容词", translation: "无聊的／感到无聊的", example: "La película es aburrida. — 这部电影很无聊。" },
        { term: "frío", ipa: "ˈfɾio", pos: "形容词", translation: "冷的", example: "La sopa está fría. — 汤凉了。" },
        { term: "feliz", ipa: "feˈliθ", pos: "形容词", translation: "开心的", example: "Estoy feliz hoy. — 我今天很开心。" },
        { term: "cerrado", ipa: "θeˈraðo", pos: "形容词", translation: "关闭的", example: "La tienda está cerrada. — 店关门了。" },
        { term: "verde", ipa: "ˈbeɾðe", pos: "形容词", translation: "绿色的／未熟的", example: "La manzana está verde. — 苹果还没熟。" },
        { term: "rico", ipa: "ˈriko", pos: "形容词", translation: "有钱的／美味的", example: "La paella está rica. — 海鲜饭很好吃。" }
      ],
      exercises: [
        { kind: "open", prompt: "填入 ser 或 estar：\"Yo ___ de México, pero ahora ___ en Madrid.\"", answer: "soy / estoy", hint: "前面是出身，后面是位置。" },
        { kind: "open", prompt: "翻译：“咖啡凉了。”", answer: "El café está frío.", hint: "会改变的状态。" },
        { kind: "open", prompt: "说明差异：\"Pedro es aburrido\" 和 \"Pedro está aburrido\"", answer: "用 ser 表示 Pedro 是个无趣的人；用 estar 表示 Pedro 现在觉得无聊。" },
        { kind: "open", prompt: "选动词并说明理由：\"La fiesta ___ en el restaurante.\"", answer: "es — 活动的举行即使讲地点也用 ser。", hint: "是放在某处的东西，还是发生的事件？" },
        { kind: "open", prompt: "翻译：“我妈妈是医生，今天她累了。”", answer: "Mi madre es médica y hoy está cansada." }
      ],
      scenario: { title: "认识朋友的家人", details: "你来到西班牙朋友家的家庭聚餐。自我介绍——你是谁、来自哪里、做什么工作、旅途后感觉如何——并问候家人，一路正确选用 ser 和 estar。加分题：用 estar rico 夸菜好吃。" }
    }
  },
  {
    id: "plan-sample-ja",
    language: "Japanese",
    level: "Absolute beginner",
    lesson: {
      id: "lesson-sample-ja",
      title: "平假名：最初的十个字",
      grammar: "平假名 あ～こ",
      description: "日语混用三套书写系统，而平假名是其他一切的地基：它是音节文字，一字恰好一音，用来书写语法、固有词，以及拼出任何其他内容。本课学习前两行——五个元音和 か 行。十个字已经足以读出真正的日语单词，而且这里学到的规律会在整套字母表中不断重复。",
      expanded: true,
      alphabet: [
        { character: "あ", romanization: "a", ipa: "a", group: "元音", note: "类似“啊”的音。" },
        { character: "い", romanization: "i", ipa: "i", group: "元音", note: "短促的“衣”。" },
        { character: "う", romanization: "u", ipa: "ɯ", group: "元音", note: "嘴唇放松、不圆唇的“乌”。" },
        { character: "え", romanization: "e", ipa: "e", group: "元音", note: "类似“欸”。" },
        { character: "お", romanization: "o", ipa: "o", group: "元音", note: "干净的“喔”，结尾不滑音。" },
        { character: "か", romanization: "ka", ipa: "ka", group: "か行", note: "k + a" },
        { character: "き", romanization: "ki", ipa: "ki", group: "か行", note: "k + i" },
        { character: "く", romanization: "ku", ipa: "kɯ", group: "か行", note: "k + u" },
        { character: "け", romanization: "ke", ipa: "ke", group: "か行", note: "k + e" },
        { character: "こ", romanization: "ko", ipa: "ko", group: "か行", note: "k + o" }
      ],
      sections: [
        { heading: "日语的三套文字——为什么先学平假名", body: "书面日语交织着三套系统。汉字借自中文、承载意义（日“太阳”、语“语言”）——对中文使用者来说是一大优势，很多字你已经认得！片假名拼写外来语（コーヒー kōhī，“咖啡”）。平假名则是主力：它书写动词词尾、助词和固有词，还能拼出任何你不会写汉字的内容。童书全用平假名写成；漫画和课本里印在汉字上方的小小注音——振假名——也是平假名。先学会它，整个语言就此打开。" },
        { heading: "一字一拍", body: "平假名是音节文字，不是字母：每个字是一个“拍”（mora），一个等长的音。あい（ai）“爱”是两拍：a-i，长度相等。没有不发音的字母，没有拼写陷阱——看到什么就读什么，每一次都一样。日语的节奏像节拍器一样均匀前进，给每个字完整的一拍，就是自然口音的一半秘诀。把本课每个单词大声读出来，边读边在桌上打拍子。" },
        { heading: "五个元音：あ い う え お", body: "日语的所有声音都建立在五个元音上，发音永远不变。あ（a）如“啊”。い（i）如“衣”，短促。う（u）最特别：嘴唇放松、完全不圆唇，和中文的“乌”不同。え（e）如“欸”。お（o）是干净纯粹的“喔”，结尾没有“w”滑音。这五个字开启你将见到的每一张五十音图，而它们的顺序——a、i、u、e、o——就是日语词典的排序方式。" },
        { heading: "加上辅音：か行", body: "最美妙的部分来了：其余的平假名都是同样五个元音配上不同辅音，顺序永远不变。加上 k 就得到 か(ka)、き(ki)、く(ku)、け(ke)、こ(ko)。就这样——你已经理解整张图表的结构了。之后每一行的成本都极低：学一个辅音，重用五个元音。再偷看一眼这套系统能走多远：两个小点（浊点）让辅音浊化，か(ka) 变成 が(ga)。一个规律，无限重用。" },
        { heading: "你的第一批真单词", body: "十个字就能读出货真价实的日语：あい（ai）“爱”、いえ（ie）“家”、うえ（ue）“上面”、えき（eki）“车站”、かお（kao）“脸”、こえ（koe）“声音”、あき（aki）“秋天”、かき（kaki）“柿子”、あお（ao）“蓝色”。每个词先慢慢读，一字一拍，再用自然速度读一遍。重复的元音就是两拍：ああ（ā）读成拉长两倍的“啊”。这就是日语拼写友好的原因——读和写永远不会脱节。" },
        { heading: "怎么练习", body: "每个字写十遍，边写边大声念出它的音——手、眼、耳互相强化。照着图表的笔顺写（从上到下、从左到右）；看似啰嗦，却能让你的字迹清楚又快速，而且所有字帖都以它为前提。接着遮住单词表的罗马音一栏，只靠平假名读出单词。当 あき 不再是“一道谜题”而直接是秋天时，这些字就住进长期记忆了。每天十分钟，胜过每周一小时。" }
      ],
      vocab: [
        { term: "あい", ipa: "ai", pos: "名词", translation: "爱", example: "あい (ai) — 爱" },
        { term: "いえ", ipa: "ie", pos: "名词", translation: "家", example: "いえ (ie) — 家" },
        { term: "うえ", ipa: "ɯe", pos: "名词", translation: "上面", example: "うえ (ue) — 上面" },
        { term: "えき", ipa: "eki", pos: "名词", translation: "车站", example: "えき (eki) — 车站" },
        { term: "かお", ipa: "kao", pos: "名词", translation: "脸", example: "かお (kao) — 脸" },
        { term: "こえ", ipa: "koe", pos: "名词", translation: "声音", example: "こえ (koe) — 声音" },
        { term: "あき", ipa: "aki", pos: "名词", translation: "秋天", example: "あき (aki) — 秋天" },
        { term: "あお", ipa: "ao", pos: "名词", translation: "蓝色", example: "あお (ao) — 蓝色" }
      ],
      exercises: [
        { kind: "open", prompt: "写出罗马音：あき", answer: "aki（秋天）" },
        { kind: "open", prompt: "用平假名写出：k-o-e（声音）", answer: "こえ" },
        { kind: "open", prompt: "哪个字是“ku”？", answer: "く" },
        { kind: "open", prompt: "读出并给出意思：いえ", answer: "ie — 家" },
        { kind: "open", prompt: "用平假名拼出“kaki”（柿子），并说出它有几拍。", answer: "かき — 两拍（ka-ki）。" }
      ],
      scenario: { title: "平假名阅读游戏", details: "导师出示只用 あ～こ 写成的短单词。用罗马音大声读出，再猜猜意思。卡住时导师会给友善的提示，你上手后会逐渐加速。也请导师反向出题——听罗马音写平假名。" }
    }
  },
  {
    id: "plan-sample-ko",
    language: "Korean",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-ko",
      title: "咖啡店点单：주세요",
      grammar: "用 주세요 提出礼貌请求",
      description: "一个句型就能搞定韩国所有咖啡店、餐厅、市场摊位和便利店：[想要的东西] 주세요（juseyo）“请给我……”。本课围绕它组织整趟咖啡店之旅：说出饮品名称、用韩国方式数杯数、问价钱、付款、道谢。学完之后，你就能走到首尔任何一个柜台，礼貌地买到你想要的东西。",
      expanded: true,
      sections: [
        { heading: "一个句型走遍所有柜台", body: "韩语有好几个敬语等级，初学者常常不知道该用哪一个。好消息：购物和点单时，주세요（juseyo）永远安全。它的字面意思是“请给（我）”，属于标准的礼貌体（해요체）。任何咖啡师、店主或服务员都不会觉得它失礼，也不会觉得太过生硬。在韩国，各个年龄段的人都在各种柜台用的正是这个形式。掌握这一个词，你就能在任何地方完成交易。" },
        { heading: "句型：[东西] + 주세요", body: "把你想要的东西直接放在 주세요 前面：커피 주세요（keopi juseyo）“请给我咖啡”。물 주세요（mul juseyo）“请给我水”。이거 주세요（igeo juseyo）“请给我这个”——不会说某个词时的万能逃生口：用手一指，说出口就行。留意它和中文的差别：不需要“可以给我……吗”这类包装。韩语把礼貌打包进动词词尾 -세요 里，句子保持简短，同时完全客气。" },
        { heading: "数饮品：固有数词 + 잔", body: "韩语用“固有数词＋量词”数东西。饮品的量词是 잔（jan）“杯”：한 잔（han jan）一杯、두 잔（du jan）两杯、세 잔（se jan）三杯、네 잔（ne jan）四杯。语序是“东西＋数字＋量词＋주세요”：아메리카노 두 잔 주세요“请给我两杯美式”。注意数字在名词后面——和中文的“美式两杯”语感相近，不难适应。第一天觉得量词太多？可以省略，说 아메리카노 주세요 再比出两根手指也行。但用上 잔 会立刻让你听起来像常客。" },
        { heading: "冰的、热的、看懂菜单", body: "韩国咖啡店的菜单意外地好读，因为大多数饮品名是用韩文字母拼写的英语：아메리카노（americano）、라떼（latte）、주스（juseu，果汁）。温度放在名字前面：아이스（aiseu）“冰的”——아이스 아메리카노 주세요。热饮会听到 따뜻한（ttatteuthan）“温热的”：따뜻한 라떼 주세요。韩国人对冰美式的热爱是认真的——就算一月寒冬也照喝不误，所以你点哪种都不会突兀。" },
        { heading: "付款：얼마예요? 与刷卡文化", body: "问价钱说 얼마예요?（eolmayeyo?）“多少钱？” 价格以韩元计，你听到的多半是“千”：사천 원（sacheon won）是 4,000 韩元。别被大数字吓到——收银机一定会显示总额，把听到的价钱当成“带辅助轮的听力练习”就好。韩国是全球数一数二的刷卡社会：说 카드로 할게요（kadeuro halgeyo）“我刷卡”，一嘀就完成。现金也收，但没人预期你用现金。" },
        { heading: "堂食、带走，然后道谢", body: "点完单，经典的追问来了：드시고 가세요?（deusigo gaseyo?）“堂食吗？” 留下喝答 네（ne）“是”，带走答 포장이요（pojang-iyo）“打包，麻烦了”。饮品放上柜台时说 감사합니다（gamsahamnida）“谢谢”——最完整、最保险、到哪都通用的正式版。你也会听到店员之间用稍微柔和的 감사해요（gamsahaeyo）。接过饮品、点个头，恭喜：你刚用韩语完成了一整笔交易。" }
      ],
      vocab: [
        { term: "커피", ipa: "kʰʌpʰi", pos: "名词", translation: "咖啡", example: "커피 주세요. (keopi juseyo) — 请给我咖啡。" },
        { term: "물", ipa: "mul", pos: "名词", translation: "水", example: "물 주세요. (mul juseyo) — 请给我水。" },
        { term: "아메리카노", ipa: "amerikʰano", pos: "名词", translation: "美式咖啡", example: "아메리카노 두 잔 주세요. — 请给我两杯美式。" },
        { term: "주세요", ipa: "tɕusejo", pos: "动词（礼貌形）", translation: "请给我", example: "이거 주세요. (igeo juseyo) — 请给我这个。" },
        { term: "잔", ipa: "tɕan", pos: "量词", translation: "杯", example: "두 잔 (du jan) — 两杯" },
        { term: "아이스", ipa: "aisɯ", pos: "名词", translation: "冰的", example: "아이스 아메리카노 주세요. — 请给我冰美式。" },
        { term: "얼마예요", ipa: "ʌlmajejo", pos: "短语", translation: "多少钱？", example: "이거 얼마예요? (igeo eolmayeyo) — 这个多少钱？" },
        { term: "카드", ipa: "kʰadɯ", pos: "名词", translation: "卡", example: "카드로 할게요. (kadeuro halgeyo) — 我刷卡。" },
        { term: "포장", ipa: "pʰodʑaŋ", pos: "名词", translation: "打包、带走", example: "포장이요. (pojang-iyo) — 打包，麻烦了。" },
        { term: "감사합니다", ipa: "kamsahamnida", pos: "短语", translation: "谢谢", example: "감사합니다! (gamsahamnida) — 谢谢！" }
      ],
      exercises: [
        { kind: "open", prompt: "礼貌地点一杯咖啡。", answer: "커피 (한 잔) 주세요. (keopi han jan juseyo)" },
        { kind: "open", prompt: "问价钱。", answer: "얼마예요? (eolmayeyo?)" },
        { kind: "open", prompt: "点两杯冰美式。", answer: "아이스 아메리카노 두 잔 주세요. (aiseu amerikano du jan juseyo)" },
        { kind: "open", prompt: "店员问 드시고 가세요? 而你想带走。怎么回答？", answer: "포장이요. (pojang-iyo)" },
        { kind: "open", prompt: "说你要刷卡，然后道谢。", answer: "카드로 할게요. 감사합니다. (kadeuro halgeyo. gamsahamnida.)" }
      ],
      scenario: { title: "首尔咖啡店柜台", details: "你在首尔一家热闹咖啡店的柜台。跟店员打招呼、点饮品（点两杯也行——其中一杯冰的！）、回答堂食还是带走、问价钱、刷卡付款、道谢。每个请求都用 주세요，量词 잔 至少用一次。" }
    }
  }
  ],
  ko: [
  {
    id: "plan-sample-es",
    language: "Spanish",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-es",
      title: "ser와 estar: 두 가지 '이다'",
      grammar: "ser와 estar",
      description: "영어의 be 동사 하나에 해당하는 동사가 스페인어에는 두 개 있습니다. ser는 '무엇인가' — 정체성·출신·직업·본질을 나타내고, estar는 '어떤 상태인가' — 감정·일시적 상태·위치를 나타냅니다. 섞어 써도 뜻은 대개 통하지만, 이 구별을 익히는 것이야말로 스페인어를 자연스럽게 만드는 열쇠입니다. 게다가 일부 형용사는 어느 동사와 쓰이느냐에 따라 뜻 자체가 달라집니다.",
      expanded: true,
      sections: [
        { heading: "영어 be 하나 = 스페인어 동사 둘", body: "영어는 I am a teacher / I am tired / I am in Madrid를 모두 be 동사 하나로 해결합니다. 스페인어는 이 세 문장을 두 동사에 나눠 맡깁니다: Soy profesor.(직업 → ser), Estoy cansado.(상태 → estar), Estoy en Madrid.(위치 → estar). 둘 다 불규칙 동사이므로 주문처럼 외우세요. ser의 현재형: soy, eres, es, somos, sois, son. estar: estoy, estás, está, estamos, estáis, están. estás와 está의 강세 표시는 강세 음절을 나타내는 중요한 표기입니다." },
        { heading: "ser: 무엇인가", body: "사물의 '본질'에는 ser를 씁니다. 이름·정체성: Soy Ana.(나는 아나입니다.) 출신·국적: Marta es de Colombia.(마르타는 콜롬비아 출신입니다.) Somos mexicanos.(우리는 멕시코인입니다.) 직업: Mi madre es médica.(어머니는 의사입니다.) 본래의 성질과 외모: La casa es vieja.(그 집은 오래된 집입니다 — 집의 성격.) Pedro es alto.(페드로는 키가 큽니다.) 소유: El libro es de Juan.(그 책은 후안의 것입니다.) 판별 요령: 문장이 '이것은 근본적으로 어떤 것인가?'에 답한다면 ser입니다." },
        { heading: "ser는 시간도 알려 주고 파티도 엽니다", body: "학습자를 놀라게 하는 ser의 용법이 둘 있습니다. 첫째, 시각과 날짜는 항상 ser: Son las tres.(3시입니다.) Hoy es martes.(오늘은 화요일입니다.) 둘째, 행사: '있다'가 '열린다'는 뜻일 때는 장소 이야기라도 ser를 씁니다. La fiesta es en mi casa.(파티는 우리 집에서 열립니다.) 비교: Mi casa está en la calle Mayor.(우리 집은 마요르 거리에 있습니다.) 물건의 위치는 estar, 행사의 개최는 ser — 이렇게 기억하세요." },
        { heading: "estar: 지금 어떤 상태인가", body: "변할 수 있는 상태에는 estar를 씁니다. 감정: Estoy feliz hoy.(오늘 기분이 좋습니다.) 몸 상태: Estás cansado.(당신은 피곤합니다.) El café está frío.(커피가 식었습니다.) 상황: La tienda está cerrada.(가게가 닫혀 있습니다.) estar는 진행형도 만듭니다: Estoy estudiando español.(지금 스페인어를 공부하는 중입니다.) 기억 고리: estar의 어원은 라틴어 stare '서다' — 지금 어떤 상태로 '서' 있는지를 그리는 동사입니다." },
        { heading: "estar: 어디에 있는가", body: "사람과 사물의 위치는 아무리 영구적이어도 반드시 estar입니다: Estamos en la cocina.(우리는 부엌에 있습니다.) Madrid está en España.(마드리드는 스페인에 있습니다 — 영원히 안 움직여도 estar!) 이것이 초급자가 가장 많이 틀리는 부분입니다. '마드리드는 움직이지 않으니 본질 아닌가?'라는 논리에 넘어가지 마세요. 위치는 위치, 그래서 estar입니다. 이 규칙을 깨는 것은 앞 절의 '행사'뿐입니다." },
        { heading: "같은 형용사, 동사에 따라 다른 뜻", body: "동사에 따라 뜻이 바뀌는 형용사가 몇 개 있어 짝으로 외울 가치가 있습니다. Ana es lista.(아나는 똑똑하다.) / Ana está lista.(아나는 준비됐다.) La manzana es verde.(사과가 초록색이다.) / La manzana está verde.(사과가 아직 안 익었다.) Pedro es aburrido.(페드로는 지루한 사람이다.) / Pedro está aburrido.(페드로는 지금 지루해한다.) El chico es rico.(그 소년은 부자다.) / La paella está rica.(이 파에야는 맛있다.) 헷갈리면 자문하세요: 본질인가, 상태인가?" }
      ],
      vocab: [
        { term: "ser", ipa: "seɾ", pos: "동사", translation: "이다(본질·정체성)", example: "Soy profesor. — 나는 교사다." },
        { term: "estar", ipa: "esˈtaɾ", pos: "동사", translation: "이다(상태·위치)", example: "Estoy en casa. — 나는 집에 있다." },
        { term: "cansado", ipa: "kanˈsaðo", pos: "형용사", translation: "피곤한", example: "Estás cansado hoy. — 너 오늘 피곤하구나." },
        { term: "listo", ipa: "ˈlisto", pos: "형용사", translation: "똑똑한/준비된", example: "¿Estás listo? — 준비됐어?" },
        { term: "aburrido", ipa: "aβuˈriðo", pos: "형용사", translation: "지루한/지루해하는", example: "La película es aburrida. — 그 영화는 지루하다." },
        { term: "frío", ipa: "ˈfɾio", pos: "형용사", translation: "차가운", example: "La sopa está fría. — 수프가 식었다." },
        { term: "feliz", ipa: "feˈliθ", pos: "형용사", translation: "행복한", example: "Estoy feliz hoy. — 오늘 기분이 좋다." },
        { term: "cerrado", ipa: "θeˈraðo", pos: "형용사", translation: "닫힌", example: "La tienda está cerrada. — 가게가 닫혀 있다." },
        { term: "verde", ipa: "ˈbeɾðe", pos: "형용사", translation: "초록색의/덜 익은", example: "La manzana está verde. — 사과가 아직 안 익었다." },
        { term: "rico", ipa: "ˈriko", pos: "형용사", translation: "부유한/맛있는", example: "La paella está rica. — 파에야가 맛있다." }
      ],
      exercises: [
        { kind: "open", prompt: "ser 또는 estar를 넣으세요: \"Yo ___ de México, pero ahora ___ en Madrid.\"", answer: "soy / estoy", hint: "앞은 출신, 뒤는 위치." },
        { kind: "open", prompt: "번역하세요: '커피가 식었다.'", answer: "El café está frío.", hint: "변할 수 있는 상태." },
        { kind: "open", prompt: "차이를 설명하세요: \"Pedro es aburrido\"와 \"Pedro está aburrido\"", answer: "ser를 쓰면 '페드로는 지루한 사람이다', estar를 쓰면 '페드로는 지금 지루해한다'는 뜻입니다." },
        { kind: "open", prompt: "동사를 고르고 이유를 설명하세요: \"La fiesta ___ en el restaurante.\"", answer: "es — 행사의 개최는 장소 이야기라도 ser를 씁니다.", hint: "어딘가에 놓인 물건인가, 일어나는 일인가?" },
        { kind: "open", prompt: "번역하세요: '어머니는 의사이고, 오늘은 피곤하시다.'", answer: "Mi madre es médica y hoy está cansada." }
      ],
      scenario: { title: "친구 가족과의 저녁 식사", details: "스페인 친구네 가족 저녁에 초대받았습니다. 자기소개를 하세요 — 누구인지, 어디 출신인지, 무슨 일을 하는지, 여행 뒤 기분이 어떤지. 가족에 대해서도 물어보며 내내 ser와 estar를 알맞게 골라 쓰세요. 보너스: estar rico로 음식을 칭찬해 보세요." }
    }
  },
  {
    id: "plan-sample-ja",
    language: "Japanese",
    level: "Absolute beginner",
    lesson: {
      id: "lesson-sample-ja",
      title: "히라가나: 첫 10글자",
      grammar: "히라가나 あ~こ",
      description: "일본어는 세 가지 문자를 섞어 쓰는데, 히라가나는 그 모든 것의 토대입니다. 글자 하나가 정확히 소리 하나인 음절문자로, 문법·고유어를 적고 그 밖의 무엇이든 풀어 쓸 수 있습니다. 이 레슨에서는 첫 두 행 — 모음 다섯 개와 か행 — 을 배웁니다. 열 글자면 벌써 진짜 일본어 단어를 읽을 수 있고, 여기서 익힌 규칙이 문자표 전체에서 반복됩니다.",
      expanded: true,
      alphabet: [
        { character: "あ", romanization: "a", ipa: "a", group: "모음", note: "'아버지'의 '아'와 비슷한 소리." },
        { character: "い", romanization: "i", ipa: "i", group: "모음", note: "짧은 '이'." },
        { character: "う", romanization: "u", ipa: "ɯ", group: "모음", note: "입술을 둥글리지 않고 편하게 내는 '우'." },
        { character: "え", romanization: "e", ipa: "e", group: "모음", note: "'에' 소리." },
        { character: "お", romanization: "o", ipa: "o", group: "모음", note: "끝을 끌지 않는 깨끗한 '오'." },
        { character: "か", romanization: "ka", ipa: "ka", group: "か행", note: "k + a" },
        { character: "き", romanization: "ki", ipa: "ki", group: "か행", note: "k + i" },
        { character: "く", romanization: "ku", ipa: "kɯ", group: "か행", note: "k + u" },
        { character: "け", romanization: "ke", ipa: "ke", group: "か행", note: "k + e" },
        { character: "こ", romanization: "ko", ipa: "ko", group: "か행", note: "k + o" }
      ],
      sections: [
        { heading: "일본어의 세 문자 — 왜 히라가나부터인가", body: "일본어 글은 세 체계를 엮어 씁니다. 한자는 중국에서 빌려 와 뜻을 담는 글자(日 '해', 語 '말'), 가타카나는 외래어 표기(コーヒー kōhī, '커피'), 그리고 히라가나가 주력입니다. 동사 어미, 조사, 고유어를 적을 뿐 아니라 한자를 모르는 말은 무엇이든 풀어 쓸 수 있습니다. 어린이 책은 전부 히라가나로 쓰이고, 만화와 교과서에서 한자 위에 인쇄된 작은 발음 표기 — 후리가나 — 도 히라가나입니다. 이것부터 익히면 언어 전체가 열립니다." },
        { heading: "글자 하나에 한 박자", body: "히라가나는 알파벳이 아니라 음절문자입니다. 글자 하나가 모라(mora) 하나, 즉 길이가 같은 박자 하나입니다. あい(ai) '사랑'은 두 박자: a-i, 같은 길이로 읽습니다. 묵음도, 철자의 함정도 없습니다 — 보이는 대로 읽으면 언제나 정답입니다. 일본어의 리듬은 메트로놈처럼 고르게 흘러가고, 글자마다 온전한 한 박을 주는 것이 자연스러운 발음의 절반입니다. 이 레슨의 단어를 소리 내어 읽으며 책상을 두드려 박자를 맞춰 보세요." },
        { heading: "다섯 모음: あ い う え お", body: "일본어의 모든 소리는 다섯 모음 위에 서 있고, 발음은 언제나 같습니다. あ(a)는 '아'. い(i)는 짧은 '이'. う(u)가 요주의: 입술을 편하게 두고 절대 둥글리지 않는 소리로, 한국어 '우'보다 평평합니다. え(e)는 '에'. お(o)는 끝에 'w' 미끄러짐이 없는 순수한 '오'입니다. 이 다섯 글자가 앞으로 보게 될 모든 오십음도의 첫 줄이고, 그 순서 — a, i, u, e, o — 가 곧 일본어 사전의 정렬 순서입니다." },
        { heading: "자음을 더하면: か행", body: "여기서부터가 아름답습니다. 나머지 히라가나는 같은 다섯 모음을 다른 자음 뒤에 재활용하며, 순서도 늘 같습니다. k를 붙이면 か(ka), き(ki), く(ku), け(ke), こ(ko). 끝 — 이제 문자표 전체의 구조를 이해한 겁니다. 새 행 하나를 배우는 비용은 거의 0에 가깝습니다: 자음 하나 배우고 모음 다섯을 재사용. 이 체계가 얼마나 멀리 가는지 살짝 맛보기: 작은 점 두 개(탁점)가 자음을 유성음으로 바꿔 か(ka)가 が(ga)가 됩니다. 규칙 하나, 무한 재사용." },
        { heading: "첫 진짜 단어들", body: "열 글자로 벌써 진짜 일본어를 읽습니다: あい(ai) '사랑', いえ(ie) '집', うえ(ue) '위', えき(eki) '역', かお(kao) '얼굴', こえ(koe) '목소리', あき(aki) '가을', かき(kaki) '감', あお(ao) '파랑'. 먼저 한 글자에 한 박자로 천천히, 그다음 자연스러운 속도로 다시 읽으세요. 겹치는 모음은 그저 두 박자입니다: ああ(ā)는 두 배 길게 끄는 '아'. 읽기와 쓰기가 절대 어긋나지 않는 것 — 이것이 일본어 표기가 친절한 이유입니다." },
        { heading: "연습 방법", body: "글자마다 열 번씩 쓰면서 소리를 크게 내어 읽으세요 — 손, 눈, 귀가 서로를 강화합니다. 표의 획순을 따르세요(위에서 아래로, 왼쪽에서 오른쪽으로). 까다로워 보여도 글씨가 또렷하고 빨라지며, 앞으로 볼 모든 교본이 이를 전제로 합니다. 그다음 단어장의 로마자 열을 가리고 히라가나만으로 단어를 읽어 보세요. あき가 '퍼즐'이 아니라 곧바로 가을로 읽히는 순간, 글자들은 장기 기억에 자리 잡은 것입니다. 하루 10분이 일주일에 한 번 1시간보다 낫습니다." }
      ],
      vocab: [
        { term: "あい", ipa: "ai", pos: "명사", translation: "사랑", example: "あい (ai) — 사랑" },
        { term: "いえ", ipa: "ie", pos: "명사", translation: "집", example: "いえ (ie) — 집" },
        { term: "うえ", ipa: "ɯe", pos: "명사", translation: "위", example: "うえ (ue) — 위" },
        { term: "えき", ipa: "eki", pos: "명사", translation: "역", example: "えき (eki) — 역" },
        { term: "かお", ipa: "kao", pos: "명사", translation: "얼굴", example: "かお (kao) — 얼굴" },
        { term: "こえ", ipa: "koe", pos: "명사", translation: "목소리", example: "こえ (koe) — 목소리" },
        { term: "あき", ipa: "aki", pos: "명사", translation: "가을", example: "あき (aki) — 가을" },
        { term: "あお", ipa: "ao", pos: "명사", translation: "파랑", example: "あお (ao) — 파랑" }
      ],
      exercises: [
        { kind: "open", prompt: "로마자로 쓰세요: あき", answer: "aki (가을)" },
        { kind: "open", prompt: "히라가나로 쓰세요: k-o-e (목소리)", answer: "こえ" },
        { kind: "open", prompt: "'ku'는 어느 글자인가요?", answer: "く" },
        { kind: "open", prompt: "읽고 뜻을 말하세요: いえ", answer: "ie — 집" },
        { kind: "open", prompt: "'kaki'(감)를 히라가나로 쓰고, 몇 박자인지 말하세요.", answer: "かき — 두 박자 (ka-ki)." }
      ],
      scenario: { title: "히라가나 읽기 게임", details: "튜터가 あ~こ 글자로만 쓴 짧은 단어를 보여 줍니다. 로마자로 소리 내어 읽고 뜻을 맞혀 보세요. 막히면 튜터가 친절하게 힌트를 주고, 익숙해지면 점점 빨라집니다. 반대 방향 — 로마자를 듣고 히라가나로 쓰기 — 문제도 내 달라고 해 보세요." }
    }
  },
  {
    id: "plan-sample-en",
    language: "English",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-en",
      title: "카페에서 주문하기: Could I have ...?",
      grammar: "Could I have ...?로 하는 공손한 요청",
      description: "영어권 카페와 식당에서는 이 패턴 하나면 충분합니다: Could I have [원하는 것], please? '~ 주시겠어요?' 이 레슨은 카페 방문의 전 과정을 이 패턴으로 조립합니다 — 음료 주문, 사이즈와 개수 말하기, 커스터마이징, 계산, 감사 인사까지. 끝나면 런던에서든 뉴욕에서든 침착하게 원하는 것을 주문할 수 있습니다.",
      expanded: true,
      sections: [
        { heading: "공손한 주문의 만능 공식", body: "영어의 요청 표현은 많지만, 카페에서 가장 안전하고 자연스러운 것은 Could I have ... please?입니다. Could I have a coffee, please?(커피 한 잔 주시겠어요?) 여기서 could는 can의 과거형이 아니라 '공손함의 표지'입니다. 점원에게든 처음 보는 사람에게든 어떤 상황에서도 무례하지 않습니다. 문장 끝의 please를 잊지 마세요 — 영어권에서 please 없는 요청은 꽤 퉁명스럽게 들립니다. 이 한 문장만 몸에 배면 주문의 8할은 해결입니다." },
        { heading: "캐주얼한 표현도 알아 두기", body: "원어민의 주문을 들어 보면 변형이 다양합니다. Can I get a latte?(라테 하나 주세요.)는 미국 카페에서 아주 흔한 캐주얼형. I'll have an orange juice, please.(오렌지주스로 할게요.)는 식당의 단골 표현. 가장 간단한 것은 음료 이름 + please: A tea, please. 어느 것이든 통하지만, 망설여지면 Could I have ...?로 돌아가면 틀림없습니다. 듣기 요령: 점원의 What can I get you?(뭘 드릴까요?)가 주문 시작 신호입니다." },
        { heading: "사이즈와 개수", body: "많은 카페에서 사이즈를 묻습니다: small / medium / large. 주문에 그대로 끼워 넣으세요: Could I have a large latte, please?(라지 라테 주세요.) 두 개 이상 주문할 때는 명사를 복수형으로: two coffees, three teas. 영어에서 원래 셀 수 없는 명사도 카페에서는 a coffee(커피 한 잔)처럼 '한 잔'으로 셉니다. Could I have two coffees and a water, please? — 이렇게 하면 동료 것까지 한 번에 주문할 수 있습니다." },
        { heading: "커스터마이징: with / without", body: "세부 요청은 with / without으로 전합니다: with milk(우유 넣어서), without sugar(설탕 빼고), with an extra shot(샷 추가). Could I have a coffee with milk, please? 온도는 iced / hot을 이름 앞에: an iced latte, a hot chocolate. 못 고르겠을 때는 What do you recommend?(추천 메뉴가 뭐예요?)라고 물어보는 것도 훌륭한 회화 연습입니다. 점원의 답을 듣고 그대로 Could I have that, please?(그걸로 주세요.)라고 하면 완벽합니다." },
        { heading: "계산: How much is it?", body: "가격을 물을 때는 How much is it?(얼마예요?) 여러 개를 시켰다면 How much is it all together?(전부 얼마예요?) 점원의 단골 질문도 준비해 두세요: For here or to go?(매장에서 드시나요, 포장인가요?) — 영국에서는 Eat in or take away?라고 합니다. 대답은 For here, please. / To go, please. 카드로 내려면 Can I pay by card?지만, 대개는 단말기에 대기만 하면 말이 필요 없습니다." },
        { heading: "받고, 감사하고, 스몰토크까지", body: "음료가 완성되면 이름이나 번호로 불러 줍니다: A large latte for Ken!(켄 님의 라지 라테!) 받으면서 Thank you! / Thanks so much!를 미소와 함께. 영어권 카페에서는 점원과의 가벼운 잡담이 일상입니다. How's your day going?(오늘 어때요?)이라고 물으면 Good, thanks. How about you?라고 답하면 만점입니다. 이 한 번의 주고받기가 되는 순간, 주문은 '과제'에서 '대화'로 바뀝니다. 다음 롤플레이에서 꼭 시도해 보세요." }
      ],
      vocab: [
        { term: "coffee", ipa: "ˈkɒfi", pos: "명사", translation: "커피", example: "Could I have a coffee, please? — 커피 한 잔 주시겠어요?" },
        { term: "water", ipa: "ˈwɔːtə", pos: "명사", translation: "물", example: "Could I have some water, please? — 물 좀 주시겠어요?" },
        { term: "please", ipa: "pliːz", pos: "부사", translation: "부탁합니다", example: "A tea, please. — 홍차 부탁합니다." },
        { term: "Could I have ...?", ipa: "kʊd aɪ hæv", pos: "표현", translation: "~ 주시겠어요?", example: "Could I have a latte, please? — 라테 주시겠어요?" },
        { term: "large", ipa: "lɑːdʒ", pos: "형용사", translation: "라지, 큰", example: "A large coffee, please. — 라지 커피 부탁합니다." },
        { term: "with milk", ipa: "wɪð mɪlk", pos: "표현", translation: "우유 넣어서", example: "Coffee with milk, please. — 우유 넣은 커피 부탁합니다." },
        { term: "How much is it?", ipa: "haʊ mʌtʃ ɪz ɪt", pos: "표현", translation: "얼마예요?", example: "How much is it all together? — 전부 얼마예요?" },
        { term: "to go", ipa: "tə ɡəʊ", pos: "표현", translation: "포장으로", example: "A coffee to go, please. — 커피 포장해 주세요." },
        { term: "For here or to go?", ipa: "fə hɪə ɔː tə ɡəʊ", pos: "표현", translation: "매장에서 드시나요, 포장인가요?", example: "For here, please. — 매장에서 마실게요." },
        { term: "Thank you", ipa: "θæŋk juː", pos: "표현", translation: "감사합니다", example: "Thanks so much! — 정말 감사합니다!" }
      ],
      exercises: [
        { kind: "open", prompt: "커피 한 잔을 공손하게 주문하세요.", answer: "Could I have a coffee, please?" },
        { kind: "open", prompt: "가격을 물어보세요.", answer: "How much is it?" },
        { kind: "open", prompt: "라테 두 잔을 포장으로 주문하세요.", answer: "Could I have two lattes to go, please?" },
        { kind: "open", prompt: "점원이 For here or to go?라고 물었습니다. 매장에서 마실 때의 대답은?", answer: "For here, please." },
        { kind: "open", prompt: "우유는 넣고 설탕은 뺀 라지 커피를 주문하세요.", answer: "Could I have a large coffee with milk and without sugar, please?" }
      ],
      scenario: { title: "런던의 카페", details: "런던의 붐비는 카페에 있습니다. 점원에게 인사하고, 음료를 주문하고, 사이즈와 커스터마이징을 말하고, 가격을 묻고, 매장인지 포장인지 답한 뒤 감사 인사를 하세요. 요청에는 반드시 Could I have ...?를 사용하세요. 여유가 있다면 점원의 스몰토크에도 대답해 보세요." }
    }
  }
  ],
  es: [
  {
    id: "plan-sample-en",
    language: "English",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-en",
      title: "Pedir en una cafetería: Could I have...?",
      grammar: "peticiones corteses con Could I have...?",
      description: "En cualquier cafetería o restaurante del mundo angloparlante te basta un solo patrón: Could I have [lo que quieres], please? — \"¿Me pone..., por favor?\". Esta lección construye la visita completa a la cafetería alrededor de él: pedir la bebida, decir tamaño y cantidad, personalizar, pagar y dar las gracias. Al terminar podrás pedir con calma exactamente lo que quieres, en Londres o en Nueva York.",
      expanded: true,
      sections: [
        { heading: "La fórmula cortés universal", body: "El inglés tiene muchas maneras de pedir, pero la más segura y natural en una cafetería es Could I have... please? Could I have a coffee, please? (¿Me pone un café, por favor?) Aquí could no es el pasado de can: funciona como marcador de cortesía. No resulta descortés con nadie — ni con el camarero ni con un desconocido — en ninguna situación. No olvides el please final: en el mundo angloparlante, una petición sin please suena bastante seca. Interioriza esta única frase y tendrás resuelto el ochenta por ciento de tus pedidos." },
        { heading: "Las variantes informales", body: "Si escuchas pedir a los nativos, oirás variaciones. Can I get a latte? (¿Me das un latte?) es la forma informal omnipresente en las cafeterías americanas. I'll have an orange juice, please. (Tomaré un zumo de naranja.) es el clásico de restaurante. Lo más simple: el nombre de la bebida + please — A tea, please. Todas funcionan, pero ante la duda vuelve a Could I have...? y no fallarás. Truco de comprensión: el What can I get you? (¿Qué le pongo?) del camarero es la señal de que te toca pedir." },
        { heading: "Tamaños y números", body: "En muchas cafeterías te preguntarán el tamaño: small / medium / large. Puedes integrarlo directamente en el pedido: Could I have a large latte, please? (Un latte grande, por favor.) Para pedir más de uno, pon el sustantivo en plural: two coffees, three teas. Fíjate en que el inglés de cafetería cuenta cosas normalmente incontables: a coffee es \"un café\" (una taza). Could I have two coffees and a water, please? — y así pides para tus compañeros de una sola vez." },
        { heading: "Personalizar: with / without", body: "Los detalles se piden con with / without: with milk (con leche), without sugar (sin azúcar), with an extra shot (con un chupito extra de café). Could I have a coffee with milk, please? La temperatura va delante del nombre: an iced latte (con hielo), a hot chocolate (caliente). ¿No te decides? Pregunta What do you recommend? (¿Qué me recomienda?) — es práctica de conversación auténtica. Escucha la respuesta y remata con Could I have that, please? (Pues eso, por favor.)" },
        { heading: "Pagar: How much is it?", body: "Para preguntar el precio: How much is it? (¿Cuánto es?) Si has pedido varias cosas: How much is it all together? (¿Cuánto es todo junto?) Prepárate también para la pregunta estrella del camarero: For here or to go? (¿Para tomar aquí o para llevar?) — en Reino Unido dicen Eat in or take away? Se responde For here, please. / To go, please. Para pagar con tarjeta existe Can I pay by card?, aunque normalmente basta con acercarla al datáfono sin decir nada." },
        { heading: "Recoger, agradecer y un poco de charla", body: "Cuando tu pedido está listo, lo cantan con tu nombre o un número: A large latte for Ana! (¡Latte grande para Ana!) Al recogerlo: Thank you! / Thanks so much!, con una sonrisa. En las cafeterías angloparlantes la pequeña charla con el personal es cotidiana: si te sueltan How's your day going? (¿Qué tal va el día?), responde Good, thanks. How about you? y habrás bordado la escena. Cuando ese intercambio te salga solo, pedir habrá dejado de ser una tarea para convertirse en una conversación. Pruébalo en el juego de rol." }
      ],
      vocab: [
        { term: "coffee", ipa: "ˈkɒfi", pos: "sustantivo", translation: "café", example: "Could I have a coffee, please? — ¿Me pone un café, por favor?" },
        { term: "water", ipa: "ˈwɔːtə", pos: "sustantivo", translation: "agua", example: "Could I have some water, please? — ¿Me pone agua, por favor?" },
        { term: "please", ipa: "pliːz", pos: "adverbio", translation: "por favor", example: "A tea, please. — Un té, por favor." },
        { term: "Could I have ...?", ipa: "kʊd aɪ hæv", pos: "frase", translation: "¿me pone...?", example: "Could I have a latte, please? — ¿Me pone un latte, por favor?" },
        { term: "large", ipa: "lɑːdʒ", pos: "adjetivo", translation: "grande", example: "A large coffee, please. — Un café grande, por favor." },
        { term: "with milk", ipa: "wɪð mɪlk", pos: "frase", translation: "con leche", example: "Coffee with milk, please. — Café con leche, por favor." },
        { term: "How much is it?", ipa: "haʊ mʌtʃ ɪz ɪt", pos: "frase", translation: "¿cuánto es?", example: "How much is it all together? — ¿Cuánto es todo junto?" },
        { term: "to go", ipa: "tə ɡəʊ", pos: "frase", translation: "para llevar", example: "A coffee to go, please. — Un café para llevar, por favor." },
        { term: "For here or to go?", ipa: "fə hɪə ɔː tə ɡəʊ", pos: "frase", translation: "¿para aquí o para llevar?", example: "For here, please. — Para aquí, por favor." },
        { term: "Thank you", ipa: "θæŋk juː", pos: "frase", translation: "gracias", example: "Thanks so much! — ¡Muchísimas gracias!" }
      ],
      exercises: [
        { kind: "open", prompt: "Pide un café con cortesía.", answer: "Could I have a coffee, please?" },
        { kind: "open", prompt: "Pregunta el precio.", answer: "How much is it?" },
        { kind: "open", prompt: "Pide dos lattes para llevar.", answer: "Could I have two lattes to go, please?" },
        { kind: "open", prompt: "El camarero pregunta For here or to go? y quieres tomarlo allí. Responde.", answer: "For here, please." },
        { kind: "open", prompt: "Pide un café grande con leche y sin azúcar.", answer: "Could I have a large coffee with milk and without sugar, please?" }
      ],
      scenario: { title: "Una cafetería de Londres", details: "Estás en una cafetería concurrida de Londres. Saluda, pide tu bebida, indica tamaño y personalización, pregunta el precio, responde si es para aquí o para llevar y da las gracias — usando siempre Could I have...? Si te animas, sigue también la pequeña charla del camarero." }
    }
  },
  {
    id: "plan-sample-ja",
    language: "Japanese",
    level: "Absolute beginner",
    lesson: {
      id: "lesson-sample-ja",
      title: "Hiragana: tus primeros diez caracteres",
      grammar: "hiragana あ–こ",
      description: "El japonés mezcla tres sistemas de escritura, y el hiragana es la base de todos: un silabario donde cada carácter es exactamente un sonido, usado para la gramática, las palabras nativas y para deletrear cualquier otra cosa. Esta lección cubre las dos primeras filas — las cinco vocales y la fila k. Diez caracteres ya bastan para leer palabras japonesas reales, y el patrón que aprendes aquí se repite por todo el silabario.",
      expanded: true,
      alphabet: [
        { character: "あ", romanization: "a", ipa: "a", group: "Vocales", note: "Como la a de \"casa\"." },
        { character: "い", romanization: "i", ipa: "i", group: "Vocales", note: "Como la i de \"sí\", breve." },
        { character: "う", romanization: "u", ipa: "ɯ", group: "Vocales", note: "Labios relajados, sin redondear." },
        { character: "え", romanization: "e", ipa: "e", group: "Vocales", note: "Como la e de \"mesa\"." },
        { character: "お", romanization: "o", ipa: "o", group: "Vocales", note: "Una o pura, sin deslizamiento final." },
        { character: "か", romanization: "ka", ipa: "ka", group: "Fila k", note: "k + a" },
        { character: "き", romanization: "ki", ipa: "ki", group: "Fila k", note: "k + i" },
        { character: "く", romanization: "ku", ipa: "kɯ", group: "Fila k", note: "k + u" },
        { character: "け", romanization: "ke", ipa: "ke", group: "Fila k", note: "k + e" },
        { character: "こ", romanization: "ko", ipa: "ko", group: "Fila k", note: "k + o" }
      ],
      sections: [
        { heading: "Las tres escrituras de Japón — y por qué el hiragana va primero", body: "El japonés escrito entreteje tres sistemas. Los kanji son caracteres tomados del chino que llevan significado (日 \"sol\", 語 \"lengua\"). El katakana deletrea préstamos extranjeros (コーヒー kōhī, \"café\"). El hiragana es el caballo de batalla: escribe las terminaciones verbales, las partículas y las palabras nativas, y puede deletrear cualquier cosa cuyo kanji no conozcas. Los libros infantiles se escriben enteros en hiragana, y los furigana — esas pequeñas ayudas de lectura impresas sobre los kanji en manga y libros de texto — también son hiragana. Apréndelo primero y el idioma entero se abre." },
        { heading: "Un carácter, un tiempo", body: "El hiragana es un silabario, no un alfabeto: cada carácter es una mora, un tiempo de sonido de duración uniforme. あい (ai) \"amor\" son dos tiempos, a-i, pronunciados con igual duración. No hay letras mudas ni sorpresas ortográficas — lo que ves es exactamente lo que dices, siempre. El ritmo japonés avanza con la regularidad de un metrónomo, y dar a cada carácter su tiempo completo es la mitad del secreto de un acento natural. Lee cada palabra de esta lección en voz alta marcando los tiempos sobre la mesa." },
        { heading: "Las cinco vocales: あ い う え お", body: "Todos los sonidos del japonés se apoyan en solo cinco vocales, pronunciadas siempre igual — y para ti hay premio: son prácticamente las del español. あ (a) como en \"casa\". い (i) como en \"sí\", breve. う (u) es la única traicionera: labios relajados, sin redondear, distinta de la u española. え (e) como en \"mesa\". お (o) es una o limpia y pura, sin deslizamiento final. Estos cinco caracteres abren todas las tablas de kana que verás, y su orden — a, i, u, e, o — es el orden alfabético de los diccionarios japoneses." },
        { heading: "Añade una consonante: la fila k", body: "Aquí viene lo bonito: el resto del hiragana recicla esas mismas cinco vocales tras distintas consonantes, siempre en el mismo orden. Añade k y obtienes か (ka), き (ki), く (ku), け (ke), こ (ko). Ya está — acabas de entender la estructura de la tabla entera. Cada fila nueva cuesta casi nada: aprendes la consonante y reutilizas las vocales. Un adelanto de hasta dónde llega el sistema: dos puntitos (dakuten) sonorizan la consonante y か (ka) se convierte en が (ga). Un patrón, reutilizado sin fin." },
        { heading: "Tus primeras palabras reales", body: "Con diez caracteres ya puedes leer japonés auténtico: あい (ai) \"amor\", いえ (ie) \"casa\", うえ (ue) \"arriba\", えき (eki) \"estación\", かお (kao) \"cara\", こえ (koe) \"voz\", あき (aki) \"otoño\", かき (kaki) \"caqui\", あお (ao) \"azul\". Lee cada una despacio, un tiempo por carácter, y luego a velocidad natural. Las vocales dobladas simplemente reciben dos tiempos: ああ (ā) es una \"a\" sostenida el doble. Por eso la ortografía japonesa es tan amable — leer y escribir nunca se separan." },
        { heading: "Cómo practicar", body: "Escribe cada carácter diez veces diciendo su sonido en voz alta — mano, ojo y oído se refuerzan mutuamente. Sigue el orden de trazos de la tabla (de arriba abajo, de izquierda a derecha); parece pedante, pero hace tu escritura legible y rápida, y todos los materiales lo dan por hecho. Después tapa la columna de romanización de la tabla de vocabulario y lee las palabras solo desde el hiragana. Cuando あき deje de ser \"un rompecabezas\" y sea directamente otoño, los caracteres habrán pasado a la memoria de largo plazo. Diez minutos al día valen más que una hora a la semana." }
      ],
      vocab: [
        { term: "あい", ipa: "ai", pos: "sustantivo", translation: "amor", example: "あい (ai) — amor" },
        { term: "いえ", ipa: "ie", pos: "sustantivo", translation: "casa", example: "いえ (ie) — casa" },
        { term: "うえ", ipa: "ɯe", pos: "sustantivo", translation: "arriba, encima", example: "うえ (ue) — arriba" },
        { term: "えき", ipa: "eki", pos: "sustantivo", translation: "estación", example: "えき (eki) — estación" },
        { term: "かお", ipa: "kao", pos: "sustantivo", translation: "cara", example: "かお (kao) — cara" },
        { term: "こえ", ipa: "koe", pos: "sustantivo", translation: "voz", example: "こえ (koe) — voz" },
        { term: "あき", ipa: "aki", pos: "sustantivo", translation: "otoño", example: "あき (aki) — otoño" },
        { term: "あお", ipa: "ao", pos: "sustantivo", translation: "azul", example: "あお (ao) — azul" }
      ],
      exercises: [
        { kind: "open", prompt: "Escribe en romaji: あき", answer: "aki (otoño)" },
        { kind: "open", prompt: "Escribe en hiragana: k-o-e (voz)", answer: "こえ" },
        { kind: "open", prompt: "¿Qué carácter es \"ku\"?", answer: "く" },
        { kind: "open", prompt: "Lee y da el significado: いえ", answer: "ie — casa" },
        { kind: "open", prompt: "Deletrea \"kaki\" (caqui) en hiragana y di cuántos tiempos tiene.", answer: "かき — dos tiempos (ka-ki)." }
      ],
      scenario: { title: "Juego de lectura de hiragana", details: "Tu tutor te muestra palabras cortas escritas solo con caracteres あ–こ. Léelas en voz alta en romaji y adivina el significado. El tutor da pistas amables cuando te atascas y acelera cuando entras en calor. Pídele también el sentido inverso — de romaji a hiragana." }
    }
  },
  {
    id: "plan-sample-ko",
    language: "Korean",
    level: "Beginner",
    lesson: {
      id: "lesson-sample-ko",
      title: "Pedir en una cafetería: 주세요",
      grammar: "peticiones corteses con 주세요",
      description: "Un solo patrón abre todas las cafeterías, restaurantes, puestos de mercado y tiendas de Corea: [cosa] 주세요 (juseyo) — \"deme..., por favor\". Esta lección construye la visita completa a la cafetería a su alrededor: nombrar tu bebida, contar las tazas a la coreana, preguntar el precio, pagar y dar las gracias. Al terminar podrás acercarte a cualquier mostrador de Seúl y conseguir exactamente lo que quieres, con cortesía.",
      expanded: true,
      sections: [
        { heading: "Un patrón para todos los mostradores", body: "El coreano tiene varios niveles de cortesía, y elegir el correcto paraliza a los principiantes. Buena noticia: para comprar y pedir, 주세요 (juseyo) siempre es seguro. Significa literalmente \"deme (por favor)\", pertenece al registro cortés estándar (해요체), y ningún barista, tendero o camarero lo encontrará jamás descortés ni demasiado rígido. Oirás a coreanos de todas las edades usar exactamente esta forma en todos los mostradores del país. Domina esta única palabra y podrás comprar en cualquier parte." },
        { heading: "El patrón: [cosa] + 주세요", body: "Pon lo que quieres justo delante de 주세요: 커피 주세요 (keopi juseyo) \"Un café, por favor.\" 물 주세요 (mul juseyo) \"Agua, por favor.\" 이거 주세요 (igeo juseyo) \"Esto, por favor\" — la vía de escape universal cuando no sabes una palabra: señala y dilo. Fíjate en lo que falta comparado con el español: no hay \"podría ponerme\" ni \"quisiera\". El coreano empaqueta la cortesía en la terminación verbal -세요, así que la frase se queda corta y completamente educada a la vez." },
        { heading: "Contar bebidas: números nativos + 잔", body: "El coreano cuenta objetos con números nativos más un clasificador. Las bebidas llevan 잔 (jan), \"taza\": 한 잔 (han jan) una taza, 두 잔 (du jan) dos, 세 잔 (se jan) tres, 네 잔 (ne jan) cuatro. El orden es cosa + número + clasificador + 주세요: 아메리카노 두 잔 주세요 (amerikano du jan juseyo) \"Dos americanos, por favor.\" Sí — el número va después del sustantivo, al revés que en español. Si el primer día los clasificadores te abruman, sáltatelos: 아메리카노 주세요 con dos dedos levantados funciona. Pero el 잔 te hace sonar al instante como si no fuera tu primera vez." },
        { heading: "Frío, caliente y el menú", body: "Los menús de las cafeterías coreanas son sorprendentemente legibles, porque la mayoría de los nombres son préstamos del inglés escritos en hangul: 아메리카노 (amerikano), 라떼 (latte), 주스 (juseu, zumo). Para la temperatura, la palabra va delante: 아이스 (aiseu) \"con hielo\" — 아이스 아메리카노 주세요. Para lo caliente oirás 따뜻한 (ttatteuthan) \"caliente\": 따뜻한 라떼 주세요. Corea se toma muy en serio el café con hielo — el americano helado se pide todo el año, incluso en enero, así que encajarás pidas lo que pidas." },
        { heading: "Pagar: 얼마예요? y la cultura de la tarjeta", body: "Para preguntar el precio: 얼마예요? (eolmayeyo?) \"¿Cuánto es?\" Los precios van en wones y oirás sobre todo miles: 사천 원 (sacheon won) son 4.000 wones. No te agobies con los números grandes — la caja siempre muestra el total, así que trata el precio hablado como práctica de comprensión con ruedines. Corea es uno de los países más amigos de la tarjeta del mundo: di 카드로 할게요 (kadeuro halgeyo) \"Pago con tarjeta\", acércala y listo. El efectivo también vale, pero nadie lo espera." },
        { heading: "Para aquí, para llevar — y dar las gracias", body: "Tras pedir, llega la pregunta clásica: 드시고 가세요? (deusigo gaseyo?) \"¿Lo tomará aquí?\" Responde 네 (ne) \"sí\" para quedarte, o 포장이요 (pojang-iyo) \"para llevar, por favor\". Cuando tu bebida aterrice en el mostrador: 감사합니다 (gamsahamnida) \"gracias\" — la versión completa, segura y formal que funciona en todas partes. También oirás la algo más suave 감사해요 (gamsahaeyo) entre el propio personal. Recoge tu bebida, asiente con la cabeza y disfruta: acabas de completar una transacción entera en coreano." }
      ],
      vocab: [
        { term: "커피", ipa: "kʰʌpʰi", pos: "sustantivo", translation: "café", example: "커피 주세요. (keopi juseyo) — Un café, por favor." },
        { term: "물", ipa: "mul", pos: "sustantivo", translation: "agua", example: "물 주세요. (mul juseyo) — Agua, por favor." },
        { term: "아메리카노", ipa: "amerikʰano", pos: "sustantivo", translation: "americano", example: "아메리카노 두 잔 주세요. — Dos americanos, por favor." },
        { term: "주세요", ipa: "tɕusejo", pos: "verbo (cortés)", translation: "deme, por favor", example: "이거 주세요. (igeo juseyo) — Esto, por favor." },
        { term: "잔", ipa: "tɕan", pos: "clasificador", translation: "taza, vaso", example: "두 잔 (du jan) — dos tazas" },
        { term: "아이스", ipa: "aisɯ", pos: "sustantivo", translation: "con hielo", example: "아이스 아메리카노 주세요. — Un americano con hielo, por favor." },
        { term: "얼마예요", ipa: "ʌlmajejo", pos: "frase", translation: "¿cuánto es?", example: "이거 얼마예요? (igeo eolmayeyo) — ¿Cuánto es esto?" },
        { term: "카드", ipa: "kʰadɯ", pos: "sustantivo", translation: "tarjeta", example: "카드로 할게요. (kadeuro halgeyo) — Pago con tarjeta." },
        { term: "포장", ipa: "pʰodʑaŋ", pos: "sustantivo", translation: "para llevar", example: "포장이요. (pojang-iyo) — Para llevar, por favor." },
        { term: "감사합니다", ipa: "kamsahamnida", pos: "frase", translation: "gracias", example: "감사합니다! (gamsahamnida) — ¡Gracias!" }
      ],
      exercises: [
        { kind: "open", prompt: "Pide un café con cortesía.", answer: "커피 (한 잔) 주세요. (keopi han jan juseyo)" },
        { kind: "open", prompt: "Pregunta cuánto cuesta.", answer: "얼마예요? (eolmayeyo?)" },
        { kind: "open", prompt: "Pide dos americanos con hielo.", answer: "아이스 아메리카노 두 잔 주세요. (aiseu amerikano du jan juseyo)" },
        { kind: "open", prompt: "El barista pregunta 드시고 가세요? y lo quieres para llevar. Responde.", answer: "포장이요. (pojang-iyo)" },
        { kind: "open", prompt: "Di que pagas con tarjeta y da las gracias.", answer: "카드로 할게요. 감사합니다. (kadeuro halgeyo. gamsahamnida.)" }
      ],
      scenario: { title: "Un mostrador de café en Seúl", details: "Estás en el mostrador de una cafetería concurrida de Seúl. Saluda al barista, pide una bebida (¡o dos — una con hielo!), responde si es para aquí o para llevar, pregunta el precio, paga con tarjeta y da las gracias. Usa 주세요 en cada petición y el clasificador 잔 al menos una vez." }
    }
  }
  ]
};
