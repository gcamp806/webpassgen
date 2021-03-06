// globals
const PAGECONTAINER = document.getElementsByTagName('body')[0]
const PREFERSDARKTHEME = window.matchMedia('(prefers-color-scheme: dark)')
const THEMESWITCHER = document.getElementById('theme_switcher')

function unicodeWarn () {
  if (localStorage.getItem('unicode_warned') === null) {
    document.getElementById('overlay').style.display = 'block'
    localStorage.setItem('unicode_warned', true)
  }
}

function setDarkTheme () {
  PAGECONTAINER.classList.add('dark-theme')
  localStorage.setItem('theme', 'dark')
  THEMESWITCHER.innerText = 'Light Theme'
}

function setLightTheme () {
  PAGECONTAINER.classList.remove('dark-theme')
  localStorage.setItem('theme', 'light')
  THEMESWITCHER.innerText = 'Dark Theme'
}

function initTheme () {
  // Dark Theme was set on page load because of previously set preference.
  if (localStorage.getItem('theme') === 'dark') setDarkTheme()
  // Dark Theme was set on page load because of OS preference.
  else if (!localStorage.getItem('theme') && PREFERSDARKTHEME && PREFERSDARKTHEME.matches === true) setDarkTheme()
  // Light Theme was assumed due to page default or user preference or OS preference.
  else setLightTheme()
}

function toggleTheme () {
  if (PAGECONTAINER.classList.contains('dark-theme')) setLightTheme()
  else setDarkTheme()
}

function getEntropy () {
  return parseInt(document.querySelector("input[name='entropy']:checked").value)
}

function getSourceList (source) {
  let sourceList

  switch (source) {
    case 'diceware':
      sourceList = document.getElementById('diceware-options').value
      break
    case 'eff':
      sourceList = document.getElementById('eff-options').value
      break
    case 'alternate':
      sourceList = document.getElementById('alt-options').value
      break
    case 'bitcoin':
      sourceList = document.getElementById('bitcoin-options').value
      break
  }

  return sourceList
}

function generatePassphrase (source) {
  const sourceList = getSourceList(source)

  switch (source) {
    case 'diceware':
      generateDiceware(sourceList)
      break
    case 'eff':
      generateEff(sourceList)
      break
    case 'alternate':
      generateAlternate(sourceList)
      break
    case 'bitcoin':
      generateBitcoin(sourceList)
      break
  }
}

function secRand (count) {
  const min = (-count >>> 0) % count
  const rand = new Uint32Array(1)
  const crypto = window.crypto || window.msCrypto

  do crypto.getRandomValues(rand)
  while (rand[0] < min)

  return rand[0] % count
}

function generatePass (len, set, spaces) {
  let pass = ''
  let passArr = ''

  if (typeof set === 'string') passArr = set.split('')
  else passArr = set

  passArr = [...new Set(passArr)] // enforce unique elements in array

  for (let i = len; i > 0; i--) {
    if (spaces) {
      pass += passArr[secRand(set.length)]
      pass += ' '
    } else pass += passArr[secRand(set.length)]
  }

  return pass.trim()
}

function generateDiceware (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Basque':
      wordList = dicewareEU
      break
    case 'Bulgarian':
      wordList = dicewareBG
      break
    case 'Catalan':
      wordList = dicewareCA
      break
    case 'Chinese':
      wordList = dicewareCN
      break
    case 'Czech':
      wordList = dicewareCZ
      break
    case 'Danish':
      wordList = dicewareDA
      break
    case 'Dutch':
      wordList = dicewareNL
      break
    case 'English':
      wordList = dicewareEN
      break
    case 'English (Beale)':
      wordList = dicewareBeale
      break
    case 'Esperanto':
      wordList = dicewareEO
      break
    case 'Estonian':
      wordList = dicewareET
      break
    case 'Finnish':
      wordList = dicewareFI
      break
    case 'French':
      wordList = dicewareFR
      break
    case 'German':
      wordList = dicewareDE
      break
    case 'Greek':
      wordList = dicewareEL
      break
    case 'Hebrew':
      wordList = dicewareIW
      break
    case 'Hungarian':
      wordList = dicewareHU
      break
    case 'Italian':
      wordList = dicewareIT
      break
    case 'Japanese':
      wordList = dicewareJP
      break
    case 'Latin':
      wordList = dicewareLA
      break
    case 'Maori':
      wordList = dicewareMI
      break
    case 'Norwegian':
      wordList = dicewareNO
      break
    case 'Polish':
      wordList = dicewarePL
      break
    case 'Portuguese':
      wordList = dicewarePT
      break
    case 'Romanian':
      wordList = dicewareRO
      break
    case 'Russian':
      wordList = dicewareRU
      break
    case 'Slovak':
      wordList = dicewareSK
      break
    case 'Slovenian':
      wordList = dicewareSL
      break
    case 'Spanish':
      wordList = dicewareES
      break
    case 'Swedish':
      wordList = dicewareSV
      break
    case 'Turkish':
      wordList = dicewareTR
      break
  }

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('diceware-pass')
  const passLength = document.getElementById('diceware-length')
  const passEntropy = document.getElementById('diceware-entropy')

  pass = generatePass(len, wordList, true)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerHTML = '<span>' + pass.length + '</span>' + ' characters.'
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(wordList.length)) + '-bits.'
}

function generateEff (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Distant Words':
      wordList = effDistant
      break
    case 'Short Words':
      wordList = effShort
      break
    case 'Long Words':
      wordList = effLong
      break
    case 'Game of Thrones':
      wordList = effGameOfThrones
      break
    case 'Harry Potter':
      wordList = effHarryPotter
      break
    case 'Star Trek':
      wordList = effStarTrek
      break
    case 'Star Wars':
      wordList = effStarWars
      break
  }

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('eff-pass')
  const passLength = document.getElementById('eff-length')
  const passEntropy = document.getElementById('eff-entropy')

  pass = generatePass(len, wordList, true)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerHTML = '<span>' + pass.length + '</span>' + ' characters.'
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(wordList.length)) + '-bits.'
}

function generateAlternate (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Colors':
      return generateColors()
    case 'Elvish':
      wordList = alternateElvish
      break
    case 'English (Deseret)':
      wordList = alternateDeseret
      break
    case 'English (Shavian)':
      wordList = alternateShavian
      break
    case 'Klingon':
      wordList = alternateKlingon
      break
    case 'PGP':
      wordList = alternatePgp
      break
    case 'Pokerware':
      wordList = alternatePokerware
      break
    case 'RockYou':
      wordList = alternateRockyou
      break
    case 'Simpsons':
      wordList = alternateSimpsons
      break
    case 'Trump':
      wordList = alternateTrump
      break
  }

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')

  pass = generatePass(len, wordList, true)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerHTML = '<span>' + [...pass].length + '</span>' + ' characters.'
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(wordList.length)) + '-bits.'
}

function isTooDark (hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = (0.299 * r) + (0.587 * g) + (0.114 * b)

  if (l > 79) return false

  return true
}

function isTooLight (hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = (0.299 * r) + (0.587 * g) + (0.114 * b)

  if (l < 176) return false

  return true
}

function generateColors () {
  let tmp = ''
  const colorKeys = Object.keys(alternateColors)
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(colorKeys.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')
  let pass = generatePass(len, colorKeys, true).split(' ')
  const chosenTheme = localStorage.theme

  for (let i = 0; i < len; i++) {
    const hex = alternateColors[pass[i]]

    if (chosenTheme === undefined || chosenTheme === 'light') {
      if (isTooLight(hex)) tmp += "<span class='bold light_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      else tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
    } else if (chosenTheme === 'dark') {
      if (isTooDark(hex)) tmp += "<span class='bold dark_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      else tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
    }
  }

  passId.innerHTML = tmp.replace(/> </g, '>-<').trim()
  tmp = ''

  for (let i = 0; i < len; i++) tmp += pass[i]

  pass = tmp
  const totalLen = pass.length + (len - 1)
  passLength.innerHTML = '<span>' + totalLen + '</span>' + ' characters.'
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(colorKeys.length)) + '-bits.'
}

function generateBitcoin (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Chinese (Simp)':
      wordList = bitcoinCNSimp
      break
    case 'Chinese (Trad)':
      wordList = bitcoinCNTrad
      break
    case 'Czech':
      wordList = bitcoinCZ
      break
    case 'English':
      wordList = bitcoinEN
      break
    case 'French':
      wordList = bitcoinFR
      break
    case 'Italian':
      wordList = bitcoinIT
      break
    case 'Japanese':
      wordList = bitcoinJP
      break
    case 'Korean':
      wordList = bitcoinKR
      break
    case 'Portuguese':
      wordList = bitcoinPT
      break
    case 'Spanish':
      wordList = bitcoinES
      break
  }

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('btc-pass')
  const passLength = document.getElementById('btc-length')
  const passEntropy = document.getElementById('btc-entropy')

  pass = generatePass(len, wordList, true)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerHTML = '<span>' + pass.length + '</span>' + ' characters.'
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(wordList.length)) + '-bits.'
}

function generateNinja () {
  let pass = ''
  const ninja = ['ka', 'zu', 'mi', 'te', 'ku', 'lu', 'ji', 'ri', 'ki', 'zu', 'me', 'ta', 'rin',
    'to', 'mo', 'no', 'ke', 'shi', 'ari', 'chi', 'do', 'ru', 'mei', 'na', 'fu', 'zi']
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(ninja.length))

  for (let i = 0; i < len; i++) {
    pass += ninja[secRand(len)]

    if (i % 3 === 2 && i !== len - 1) pass += '-'
  }

  return [pass, ninja.length, Math.floor(len * Math.log2(ninja.length))]
}

function generateApple () {
  function _apple (n) {
    /*
      See https://twitter.com/AaronToponce/status/1131406726069084160 for full analysis.

      For n ≥ 1 blocks, the entropy in bits per block is:
        log2(
          (6n - 1)      //  One lowercase alphabetic character is randomly capitalized
          * 19^(4n - 1) //  The total possible combinations of consonants
          * 6^(2n)      //  The total possible combinations of vowels
          * 10 * 2n     //  An 'edge' character is a random digit
        )

      E.G.:
        DVccvc:                      log2( 5 * 19^3  * 6^2 * 10 * 2) ~=  24.558 bits
        cvCcvD-cvccvc:               log2(11 * 19^7  * 6^4 * 10 * 4) ~=  48.857 bits
        cvcCvc-Dvccvc-cvccvc:        log2(17 * 19^11 * 6^6 * 10 * 6) ~=  72.231 bits
        cvccVc-cvccvD-cvccvc-cvccvc: log2(23 * 19^15 * 6^8 * 10 * 8) ~=  95.244 bits
        et cetera, et cetera, et cetera.
    */
    return Math.floor(Math.log2((6 * n - 1) * 19 ** (4 * n - 1) * 6 ** (2 * n) * 20 * n))
  }

  const pass = []
  const digits = '0123456789'
  const vowels = 'aeiouy'
  const consonants = 'bcdfghjkmnpqrstvwxz'
  const entropy = getEntropy()
  let n = 1 // number of blocks

  while (_apple(n) <= entropy) n++

  for (let i = 0; i < n; i++) {
    pass[6 * i] = generatePass(1, consonants)
    pass[6 * i + 1] = generatePass(1, vowels)
    pass[6 * i + 2] = generatePass(1, consonants)
    pass[6 * i + 3] = generatePass(1, consonants)
    pass[6 * i + 4] = generatePass(1, vowels)
    pass[6 * i + 5] = generatePass(1, consonants)
  }

  let digitLoc = 0
  let charLoc = 0
  const edge = secRand(2 * n) // [0, 2n)
  const digit = generatePass(1, digits)

  if (edge % 2 === 0) digitLoc = 3 * edge
  else digitLoc = 3 * edge + 2

  pass[digitLoc] = digit

  do charLoc = secRand(pass.length)
  while (charLoc === digitLoc)

  pass[charLoc] = pass[charLoc].toUpperCase()

  for (let i = n - 1; i > 0; i--) pass.splice(6 * i, 0, '-')

  return [pass.join(''), pass.length, _apple(n)]
}

function generateBabble () {
  const pass = []
  const vowels = 'aeiouy'
  const consonants = 'bcdfghklmnprstvzx'
  let entropy = getEntropy()
  const vowelEnt = Math.log2(vowels.length)
  const consEnt = Math.log2(consonants.length)
  const outerEnt = (2 * consEnt) + (2 * vowelEnt)
  const innerEnt = (3 * consEnt) + (2 * vowelEnt)

  entropy = entropy - (2 * outerEnt)

  const len = Math.ceil(entropy / innerEnt)
  const totalEnt = outerEnt + (len * innerEnt) + outerEnt

  for (let i = 0; i < len + 2; i++) {
    for (let j = 0; j < 5; j++) {
      if (j % 2 === 0) pass[(5 * i) + j] = generatePass(1, consonants)
      else pass[(5 * i) + j] = generatePass(1, vowels)
    }
  }

  pass[0] = 'x'
  pass[pass.length - 1] = 'x'

  for (let i = pass.length; i > 0; i -= 5) pass.splice(i, 0, '-')

  pass.pop() // strip last '-'

  return [pass.join(''), (len + 2) * 5, Math.floor(totalEnt)]
}

function generateKpop () {
  // 64 unique words = 6 bits of entropy per word
  const kpop = ['A', 'Ah', 'Bae', 'Bin', 'Bo', 'Choi', 'Chul', 'Da', 'Do', 'Dong', 'Eun', 'Gi', 'Gun', 'Ha', 'Hae', 'Hee',
    'Ho', 'Hu', 'Hwa', 'Hwan', 'Hye', 'Hyo', 'Hyun', 'Il', 'In', 'Ja', 'Jae', 'Ji', 'Jin', 'Jong', 'Joo', 'Joon',
    'Ju', 'Jun', 'Jung', 'Ki', 'Kun', 'Kyu', 'Lee', 'Mi', 'Min', 'Moon', 'Nam', 'Ok', 'Park', 'Rin', 'Seo', 'Seul',
    'Shi', 'Sik', 'So', 'Song', 'Soo', 'Su', 'Sun', 'Sung', 'Won', 'Woo', 'Ye', 'Yeon', 'Yoo', 'Yu', 'Yul', 'Yun']
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(kpop.length))
  let pass = ''

  for (let i = 0; i < len; i++) {
    pass += kpop[secRand(len)]
    if (i % 2 === 1 && i !== len - 1) pass += '-'
  }

  return [pass, kpop.length, Math.floor(len * Math.log2(kpop.length))]
}

function generatePseudowords () {
  let ret = []
  const pseudo = document.getElementById('pseudo-options').value

  if (pseudo === 'Apple, Inc.') ret = generateApple()
  else if (pseudo === 'Bubble Babble') ret = generateBabble()
  else if (pseudo === 'Secret Ninja') ret = generateNinja()
  else if (pseudo === 'Korean K-pop') ret = generateKpop()

  const pass = ret[0]
  const ent = ret[2]
  const passId = document.getElementById('pseudo-pass')
  const passLength = document.getElementById('pseudo-length')
  const passEntropy = document.getElementById('pseudo-entropy')

  passId.innerText = pass
  passLength.innerHTML = pass.length + ' characters.'
  passEntropy.innerHTML = '~' + ent + '-bits.'
}

function generateRandom () {
  let s = ''
  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const option = document.getElementById('random-options').value

  switch (option) {
    // ASCII optgroup
    case 'Base94':
      for (let i = 0; i < 94; i++) s += String.fromCharCode(33 + i)
      break
    case 'Base85':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+-;<=>?@^_`{|}~'
      break
    case 'Base64':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
      break
    case 'Base62':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      break
    case 'Base58':
      s = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      break
    case 'Base52':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      break
    case 'Base36':
      s = '0123456789abcdefghijklmnopqrstuvwxyz'
      break
    case 'Base32':
      s = '0123456789abcdefghjkmnpqrstvwxyz'
      break
    case 'Base26':
      s = 'abcdefghijklmnopqrstuvwxyz'
      break
    case 'Base16':
      s = '0123456789abcdef'
      break
    case 'Base10':
      s = '0123456789'
      break
    case 'Base8':
      s = '01234567'
      break
    case 'Base2':
      s = '01'
      break
    case 'Coin Flips':
      s = 'HT'
      break
    case 'DNA Sequence':
      s = 'ACGT'
      break
    // Unicode optgroup
    case 'Braille': // Base256
      unicodeWarn()
      // first character is not an ASCII space, but could still break lines
      s = ' ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊⠋⠌⠍⠎⠏⠐⠑⠒⠓⠔⠕⠖⠗⠘⠙⠚⠛⠜⠝⠞⠟⠠⠡⠢⠣⠤⠥⠦⠧⠨⠩⠪⠫⠬⠭⠮⠯⠰⠱⠲⠳⠴⠵⠶⠷⠸⠹⠺⠻⠼⠽⠾⠿'
      s += '⡀⡁⡂⡃⡄⡅⡆⡇⡈⡉⡊⡋⡌⡍⡎⡏⡐⡑⡒⡓⡔⡕⡖⡗⡘⡙⡚⡛⡜⡝⡞⡟⡠⡡⡢⡣⡤⡥⡦⡧⡨⡩⡪⡫⡬⡭⡮⡯⡰⡱⡲⡳⡴⡵⡶⡷⡸⡹⡺⡻⡼⡽⡾⡿'
      s += '⢀⢁⢂⢃⢄⢅⢆⢇⢈⢉⢊⢋⢌⢍⢎⢏⢐⢑⢒⢓⢔⢕⢖⢗⢘⢙⢚⢛⢜⢝⢞⢟⢠⢡⢢⢣⢤⢥⢦⢧⢨⢩⢪⢫⢬⢭⢮⢯⢰⢱⢲⢳⢴⢵⢶⢷⢸⢹⢺⢻⢼⢽⢾⢿'
      s += '⣀⣁⣂⣃⣄⣅⣆⣇⣈⣉⣊⣋⣌⣍⣎⣏⣐⣑⣒⣓⣔⣕⣖⣗⣘⣙⣚⣛⣜⣝⣞⣟⣠⣡⣢⣣⣤⣥⣦⣧⣨⣩⣪⣫⣬⣭⣮⣯⣰⣱⣲⣳⣴⣵⣶⣷⣸⣹⣺⣻⣼⣽⣾⣿'
      break
    case 'Emoji':
      return generateEmoji()
    case 'ISO 8859-1': // Base188
      unicodeWarn()
      for (let i = 0; i < 94; i++) s += String.fromCharCode(33 + i)
      for (let i = 0; i < 95; i++) s += String.fromCharCode(161 + i)
      s = s.replace(String.fromCharCode(173), '') // soft-hyphen isn't graphical
      break
    case 'Latin Extended': // Base256
      unicodeWarn()
      s = 'ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿ'
      s += 'ṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿ'
      s += 'ẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾế'
      s += 'ỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹỺỻỼỽỾỿ'
      break
  }

  const len = Math.ceil(entropy / Math.log2(s.length))
  const pass = generatePass(len, s, false)

  passLength.innerHTML = len + ' characters.'
  passId.removeAttribute('style') // from emoji
  passId.innerText = pass
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(s.length)) + '-bits.'
}

function generateEmoji () {
  unicodeWarn()

  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const len = Math.ceil(entropy / Math.log2(randomEmoji.length))
  const pass = generatePass(len, randomEmoji)

  passLength.innerHTML = len + ' characters.'
  passId.style.fontFamily = 'Emoji'
  passId.innerText = pass
  passEntropy.innerHTML = '~' + Math.floor(len * Math.log2(randomEmoji.length)) + '-bits.'
}

// Dicekey functions
function shuffleDice () {
  const chars = 'ABCDEFGHIJKLMNOPRSTUVWXYZ'.split('')

  for (let i = 0; i < chars.length; i++) {
    const randInt = secRand(chars.length)
    const tmp = chars[randInt]

    chars[randInt] = chars[i]
    chars[i] = tmp
  }

  return chars // start with string, return array
}
function rotateDice () {
  for (let i = 1; i <= 25; i++) {
    const orientations = []
    const cell = document.getElementById('cell' + i)
    const randInt = secRand(4)

    if (randInt === 1) {
      orientations.push('E')
      cell.classList.add('rotate90')
    } else if (randInt === 2) {
      orientations.push('S')
      cell.classList.add('rotate180')
    } else if (randInt === 3) {
      orientations.push('W')
      cell.classList.add('rotate270')
    } else orientations.push('N')
  }
}
function convertDecToBin (num) {
  const res = num.toString(2)
  return res.padStart(11, '0')
}
function opticalBits (res) {
  // Every JavaScript linter with bitch about this. Tough. I'm not creating 25*12 = 300 lines.
  // black = 0, white = 1
  // [2^10, 2^9, 2^8, ..., 2^2, 2^1, 2^0]
  const topBits = {
    A1: 2002, B1: 1996, C1: 1946, D1: 1924, E1: 1954, F1: 1864, G1: 1878, H1: 1904, I1: 1844, J1: 1830, K1: 1846, L1: 1812, M1: 1798, N1: 1744, O1: 1762, P1: 1766, R1: 1698, S1: 1668, T1: 1710, U1: 1676, V1: 1694, W1: 1648, X1: 1622, Y1: 1642, Z1: 1656,
    A2: 2018, B2: 1926, C2: 1952, D2: 1968, E2: 1944, F2: 1892, G2: 1908, H2: 1884, I2: 1816, J2: 1820, K2: 1848, L2: 1818, M2: 1800, N2: 1778, O2: 1772, P2: 1768, R2: 1708, S2: 1674, T2: 1696, U2: 1666, V2: 1680, W2: 1604, X2: 1624, Y2: 1636, Z2: 1654,
    A3: 1984, B3: 1928, C3: 1938, D3: 1972, E3: 1942, F3: 1898, G3: 1870, H3: 1874, I3: 1814, J3: 1810, K3: 1794, L3: 1808, M3: 1842, N3: 1736, O3: 1750, P3: 1732, R3: 1678, S3: 1702, T3: 1690, U3: 1672, V3: 1706, W3: 1610, X3: 1634, Y3: 1608, Z3: 1612,
    A4: 2020, B4: 1932, C4: 1960, D4: 1934, E4: 1868, F4: 1872, G4: 1856, H4: 1896, I4: 1836, J4: 1840, K4: 1804, L4: 1822, M4: 1748, N4: 1734, O4: 1752, P4: 1738, R4: 1716, S4: 1704, T4: 1684, U4: 1670, V4: 1640, W4: 1614, X4: 1644, Y4: 1606, Z4: 1602,
    A5: 2004, B5: 1976, C5: 1958, D5: 1920, E5: 1912, F5: 1890, G5: 1866, H5: 1894, I5: 1826, J5: 1802, K5: 1824, L5: 1828, M5: 1760, N5: 1728, O5: 1746, P5: 1776, R5: 1722, S5: 1682, T5: 1720, U5: 1724, V5: 1618, W5: 1652, X5: 1630, Y5: 1660, Z5: 1646,
    A6: 1986, B6: 1940, C6: 1930, D6: 1964, E6: 1862, F6: 1880, G6: 1860, H6: 1850, I6: 1832, J6: 1796, K6: 1838, L6: 1834, M6: 1764, N6: 1742, O6: 1756, P6: 1688, R6: 1712, S6: 1692, T6: 1718, U6: 1714, V6: 1628, W6: 1658, X6: 1616, Y6: 1650, Z6: 1632
  }
  const bottomBits = {
    A1: 1038, B1: 1086, C1: 1114, D1: 1130, E1: 1146, F1: 1174, G1: 1190, H1: 1206, I1: 1222, J1: 1234, K1: 1248, L1: 1260, M1: 1272, N1: 1302, O1: 1320, P1: 1332, R1: 1348, S1: 1364, T1: 1376, U1: 1388, V1: 1400, W1: 1416, X1: 1432, Y1: 1444, Z1: 1456,
    A2: 1046, B2: 1100, C2: 1116, D2: 1134, E2: 1148, F2: 1176, G2: 1194, H2: 1208, I2: 1224, J2: 1236, K2: 1250, L2: 1262, M2: 1274, N2: 1306, O2: 1322, P2: 1334, R2: 1350, S2: 1366, T2: 1378, U2: 1390, V2: 1402, W2: 1420, X2: 1434, Y2: 1446, Z2: 1458,
    A3: 1050, B3: 1102, C3: 1122, D3: 1138, E3: 1150, F3: 1178, G3: 1196, H3: 1210, I3: 1226, J3: 1238, K3: 1252, L3: 1264, M3: 1276, N3: 1308, O3: 1324, P3: 1336, R3: 1354, S3: 1368, T3: 1380, U3: 1392, V3: 1404, W3: 1422, X3: 1436, Y3: 1448, Z3: 1460,
    A4: 1068, B4: 1106, C4: 1124, D4: 1140, E4: 1162, F4: 1180, G4: 1198, H4: 1212, I4: 1228, J4: 1242, K4: 1254, L4: 1266, M4: 1290, N4: 1310, O4: 1326, P4: 1338, R4: 1356, S4: 1370, T4: 1382, U4: 1394, V4: 1410, W4: 1426, X4: 1438, Y4: 1450, Z4: 1462,
    A5: 1076, B5: 1110, C5: 1126, D5: 1142, E5: 1166, F5: 1186, G5: 1200, H5: 1214, I5: 1230, J5: 1244, K5: 1256, L5: 1268, M5: 1294, N5: 1316, O5: 1328, P5: 1340, R5: 1358, S5: 1372, T5: 1384, U5: 1396, V5: 1412, W5: 1428, X5: 1440, Y5: 1452, Z5: 1464,
    A6: 1084, B6: 1112, C6: 1128, D6: 1144, E6: 1172, F6: 1188, G6: 1202, H6: 1220, I6: 1232, J6: 1246, K6: 1258, L6: 1270, M6: 1298, N6: 1318, O6: 1330, P6: 1346, R6: 1360, S6: 1374, T6: 1386, U6: 1398, V6: 1414, W6: 1430, X6: 1442, Y6: 1454, Z6: 1466
  }

  return [topBits[res], bottomBits[res]]
}
function generatePixels (bitString) {
  let divs = ''

  for (let i = 0; i < 11; i++) {
    if (bitString[i] === '0') divs += '<div class="black bit"></div>'
    else divs += '<div class="white bit"></div>'
  }

  return divs
}
function populateCells () {
  const diceArray = shuffleDice()

  for (let i = 1; i <= 25; i++) {
    const cell = document.getElementById('cell' + i)
    const die = diceArray[i - 1]
    const side = secRand(6) + 1
    const res = die + side

    const topBits = opticalBits(res)[0]
    const topDivs = generatePixels(convertDecToBin(topBits))
    const topDiv = document.createElement('div')

    const face = document.createElement('div')

    const bottomBits = opticalBits(res)[1]
    const bottomDivs = generatePixels(convertDecToBin(bottomBits))
    const bottomDiv = document.createElement('div')

    topDiv.className = 'bits'
    topDiv.innerHTML = topDivs
    cell.appendChild(topDiv)

    face.className = 'text flex'
    face.innerText = res
    cell.appendChild(face)

    bottomDiv.className = 'bits'
    bottomDiv.innerHTML = bottomDivs
    cell.appendChild(bottomDiv)
  }

  rotateDice()
}
function resetCells () {
  for (let i = 1; i <= 25; i++) {
    const cell = document.getElementById('cell' + i)

    cell.className = 'tableCell'

    for (let i = 2; i >= 0; i--) cell.removeChild(cell.childNodes[i])
  }
}
function getDiceKey () {
  let orientation = ''
  const dice = []
  let dicekey = ''

  for (let i = 1; i <= 25; i++) {
    const cell = document.getElementById('cell' + i)

    if (cell.classList.contains('rotate90')) orientation = 'E'
    else if (cell.classList.contains('rotate180')) orientation = 'S'
    else if (cell.classList.contains('rotate270')) orientation = 'W'
    else orientation = 'N'

    dicekey += cell.children[1].innerText
    dicekey += orientation

    if (i < 25) dicekey += ' '
  }

  console.clear()
  console.log(dicekey)
}
