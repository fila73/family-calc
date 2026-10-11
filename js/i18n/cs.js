/**
 * Český slovník příbuzenských vztahů
 * Zdroje: Česká Wikipedie (Seznam členů rodiny), genealogické a historické prameny.
 */

export const cs = {
  code: 'cs',
  name: 'Čeština',
  labels: {
    appTitle: 'Rodinná kalkulačka',
    subtitle: 'Kalkulačka příbuzenských vztahů',
    egoGender: 'Moje pohlaví',
    male: 'Muž ♂',
    female: 'Žena ♀',
    self: 'JÁ (proband)',
    selfArchaic: 'EGO / střen',
    selfDesc: 'Výchozí osoba, od níž se odvíjí genealogický vztah',
    chainPrefix: 'Můj',
    chainPrefixFemale: 'Moje',
    unknownRelation: 'Vzdálený příbuzný',
    unknownDesc: 'Vztah je příliš složený nebo v češtině nemá specifické jednoslovné pojmenování',
    mutualTitle: 'Jak říká on mě?',
    reciprocal: 'Vzájemné oslovení',
    generationLabel: 'Generace',
    lineTypeLabel: 'Linie',
    archaicLabel: 'Historické / staročeské pojmenování',
    explanationLabel: 'Vysvětlení cesty',
    clear: 'Smazat',
    backspace: 'Zpět',
    calculate: 'Spočítat',
    mutual: 'Vzájemný vztah',
    modStep: 'Nevlastní',
    modGod: 'Křestní',
    tokens: {
      f: 'otec',
      m: 'matka',
      s: 'syn',
      d: 'dcera',
      b: 'bratr',
      ob: 'starší bratr',
      lb: 'mladší bratr',
      z: 'sestra',
      oz: 'starší sestra',
      lz: 'mladší sestra',
      h: 'manžel',
      w: 'manželka',
      step_f: 'otčím',
      step_m: 'macecha',
      step_s: 'pastorek',
      step_d: 'pastorkyně',
      step_b: 'nevl. bratr',
      step_z: 'nevl. sestra',
      step_h: 'nový manžel',
      step_w: 'nová manželka',
      god_f: 'kmotr',
      god_m: 'kmotra',
      god_s: 'kmotřenec',
      god_d: 'kmotřenka'
    },
    lineTypes: {
      direct_ascendant: 'Přímá vzestupná linie (předkové)',
      direct_descendant: 'Přímá sestupná linie (potomci)',
      sibling: 'Sourozenecká linie',
      collateral: 'Pobočná linie (strýcové, bratranci, synovci)',
      affinity: 'Sešvagření (příbuzenství sňatkem)',
      step: 'Nevlastní a polorodí příbuzní',
      spiritual: 'Příbuzní křtem (duchovní)'
    }
  },
  relations: {
    // === Nevlastní a polorodí příbuzní (Macecha, otčím, pastorek...) ===
    'step_m': {
      name: 'Macecha',
      archaic: 'Nevlastní matka (žena otce, která není matkou)',
      description: 'Nová manželka tvého otce, biologicky nepříbuzná',
      lineType: 'step'
    },
    'step_f': {
      name: 'Otčím',
      archaic: 'Nevlastní otec (muž matky, který není otcem)',
      description: 'Nový manžel tvé matky, biologicky nepříbuzný',
      lineType: 'step'
    },
    'step_s': {
      name: 'Pastorek',
      archaic: 'Nevlastní syn (syn manžela/manželky z dřívějška)',
      description: 'Syn tvého partnera z předchozího svazku',
      lineType: 'step'
    },
    'step_d': {
      name: 'Pastorkyně',
      archaic: 'Nevlastní dcera (dcera manžela/manželky z dřívějška)',
      description: 'Dcera tvého partnera z předchozího svazku',
      lineType: 'step'
    },
    'step_b': {
      name: 'Nevlastní bratr',
      archaic: 'Syn macechy nebo otčíma z jiného svazku',
      description: 'Syn tvého nevlastního rodiče z jeho dřívějšího vztahu (žádná biologická příbuznost)',
      lineType: 'step'
    },
    'step_z': {
      name: 'Nevlastní sestra',
      archaic: 'Dcera macechy nebo otčíma z jiného svazku',
      description: 'Dcera tvého nevlastního rodiče z jeho dřívějšího vztahu (žádná biologická příbuznost)',
      lineType: 'step'
    },
    'm,step_h,s': {
      name: 'Polobratr (jednobřišní)',
      archaic: 'Staročesky/latinsky frater uterinus',
      description: 'Syn tvé matky s jiným mužem (máte společnou matku, ale jiného otce)',
      lineType: 'step'
    },
    'm,step_h,d': {
      name: 'Polosestra (jednobřišní)',
      archaic: 'Staročesky/latinsky soror uterina',
      description: 'Dcera tvé matky s jiným mužem (máte společnou matku, ale jiného otce)',
      lineType: 'step'
    },
    'f,step_w,s': {
      name: 'Polobratr (jednokrevní)',
      archaic: 'Staročesky/latinsky frater consanguineus',
      description: 'Syn tvého otce s jinou ženou/macechou (máte společného otce, ale jinou matku)',
      lineType: 'step'
    },
    'f,step_w,d': {
      name: 'Polosestra (jednokrevní)',
      archaic: 'Staročesky/latinsky soror consanguinea',
      description: 'Dcera tvého otce s jinou ženou/macechou (máte společného otce, ale jinou matku)',
      lineType: 'step'
    },
    'step_m,s': {
      name: 'Polobratr (jednokrevní)',
      archaic: 'Syn otce a macechy (jednokrevní polobratr)',
      description: 'Syn tvého otce a macechy',
      lineType: 'step'
    },
    'step_m,d': {
      name: 'Polosestra (jednokrevní)',
      archaic: 'Dcera otce a macechy (jednokrevní polosestra)',
      description: 'Dcera tvého otce a macechy',
      lineType: 'step'
    },
    'step_f,s': {
      name: 'Polobratr (jednobřišní)',
      archaic: 'Syn matky a otčíma (jednobřišní polobratr)',
      description: 'Syn tvé matky a otčíma',
      lineType: 'step'
    },
    'step_f,d': {
      name: 'Polosestra (jednobřišní)',
      archaic: 'Dcera matky a otčíma (jednobřišní polosestra)',
      description: 'Dcera tvé matky a otčíma',
      lineType: 'step'
    },

    // === Příbuzní křtem (Duchovní příbuzenství) ===
    'god_f': {
      name: 'Kmotr',
      archaic: 'Kmoch (duchovní otec při křtu)',
      description: 'Muž, který se při křtu zavazuje pečovat o dítě',
      lineType: 'spiritual'
    },
    'god_m': {
      name: 'Kmotra',
      archaic: 'Kmotřička (duchovní matka při křtu)',
      description: 'Žena, která se při křtu zavazuje pečovat o dítě',
      lineType: 'spiritual'
    },
    'god_s': {
      name: 'Kmotřenec',
      archaic: 'Duchovní syn vůči kmotrovi/kmotře',
      description: 'Chlapec vůči svému kmotrovi nebo kmotře',
      lineType: 'spiritual'
    },
    'god_d': {
      name: 'Kmotřenka',
      archaic: 'Duchovní dcera vůči kmotrovi/kmotře',
      description: 'Dívka vůči svému kmotrovi nebo kmotře',
      lineType: 'spiritual'
    },

    // === 1. generace předků (Rodiče) ===
    'f': {
      name: 'Otec',
      archaic: 'Táta, knižně děd/ot',
      description: 'Tvůj mužský rodič',
      lineType: 'direct_ascendant'
    },
    'm': {
      name: 'Matka',
      archaic: 'Máma, zastarale máti, máť',
      description: 'Tvůj ženský rodič',
      lineType: 'direct_ascendant'
    },

    // === 2. generace předků (Prarodiče) ===
    'f,f': {
      name: 'Dědeček (otcův otec)',
      archaic: 'Děda, děd, expresivně dědek',
      description: 'Otec tvého otce (prarodič z otcovy strany)',
      lineType: 'direct_ascendant'
    },
    'f,m': {
      name: 'Babička (otcova matka)',
      archaic: 'Bába, babka',
      description: 'Matka tvého otce (prarodič z otcovy strany)',
      lineType: 'direct_ascendant'
    },
    'm,f': {
      name: 'Dědeček (matčin otec)',
      archaic: 'Lidově/nářečně stařeček',
      description: 'Otec tvé matky (prarodič z matčiny strany)',
      lineType: 'direct_ascendant'
    },
    'm,m': {
      name: 'Babička (matčina matka)',
      archaic: 'Lidově/nářečně stařenka, starucha',
      description: 'Matka tvé matky (prarodič z matčiny strany)',
      lineType: 'direct_ascendant'
    },

    // === 3. generace předků (Praprarodiče) ===
    'f,f,f': {
      name: 'Pradědeček',
      archaic: 'Praděd, staročesky též předděd, nadděd',
      description: 'Otec tvého dědečka',
      lineType: 'direct_ascendant'
    },
    'f,f,m': {
      name: 'Prababička',
      archaic: 'Prabába',
      description: 'Matka tvého dědečka',
      lineType: 'direct_ascendant'
    },
    'f,m,f': {
      name: 'Pradědeček',
      archaic: 'Praděd, předděd',
      description: 'Otec tvé babičky z otcovy strany',
      lineType: 'direct_ascendant'
    },
    'f,m,m': {
      name: 'Prababička',
      archaic: 'Prabába',
      description: 'Matka tvé babičky z otcovy strany',
      lineType: 'direct_ascendant'
    },
    'm,f,f': {
      name: 'Pradědeček',
      archaic: 'Praděd, předděd',
      description: 'Otec tvého dědečka z matčiny strany',
      lineType: 'direct_ascendant'
    },
    'm,f,m': {
      name: 'Prababička',
      archaic: 'Prabába',
      description: 'Matka tvého dědečka z matčiny strany',
      lineType: 'direct_ascendant'
    },
    'm,m,f': {
      name: 'Pradědeček',
      archaic: 'Praděd, předděd',
      description: 'Otec tvé babičky z matčiny strany',
      lineType: 'direct_ascendant'
    },
    'm,m,m': {
      name: 'Prababička',
      archaic: 'Prabába',
      description: 'Matka tvé babičky z matčiny strany',
      lineType: 'direct_ascendant'
    },

    // === Sourozenci ===
    'b': {
      name: 'Bratr',
      archaic: 'Brácha, staročesky brat',
      description: 'Tvůj mužský sourozenec',
      lineType: 'sibling'
    },
    'z': {
      name: 'Sestra',
      archaic: 'Ségra, zastarale sstřice',
      description: 'Tvůj ženský sourozenec',
      lineType: 'sibling'
    },

    // === Potomci (1. generace) ===
    's': {
      name: 'Syn',
      archaic: 'První syn: prvenec; synek',
      description: 'Tvůj mužský potomek v první generaci',
      lineType: 'direct_descendant'
    },
    'd': {
      name: 'Dcera',
      archaic: 'Dcerka, cérka',
      description: 'Tvůj ženský potomek v první generaci',
      lineType: 'direct_descendant'
    },

    // === Vnoučata (2. generace potomků) ===
    's,s': {
      name: 'Vnuk (syn syna)',
      archaic: 'Vnouček',
      description: 'Syn tvého syna',
      lineType: 'direct_descendant'
    },
    's,d': {
      name: 'Vnučka (dcera syna)',
      archaic: 'Vnučka',
      description: 'Dcera tvého syna',
      lineType: 'direct_descendant'
    },
    'd,s': {
      name: 'Vnuk (syn dcery)',
      archaic: 'Vnouček',
      description: 'Syn tvé dcery',
      lineType: 'direct_descendant'
    },
    'd,d': {
      name: 'Vnučka (dcera dcery)',
      archaic: 'Vnučka',
      description: 'Dcera tvé dcery',
      lineType: 'direct_descendant'
    },

    // === Pravnoučata (3. generace potomků) ===
    's,s,s': {
      name: 'Pravnuk',
      archaic: 'Staročesky též podvnuk, zavnuk',
      description: 'Syn tvého vnuka',
      lineType: 'direct_descendant'
    },
    's,s,d': {
      name: 'Pravnučka',
      archaic: 'Pravnučka',
      description: 'Dcera tvého vnuka',
      lineType: 'direct_descendant'
    },
    'd,d,s': {
      name: 'Pravnuk',
      archaic: 'Podvnuk, zavnuk',
      description: 'Syn tvé vnučky',
      lineType: 'direct_descendant'
    },
    'd,d,d': {
      name: 'Pravnučka',
      archaic: 'Pravnučka',
      description: 'Dcera tvé vnučky',
      lineType: 'direct_descendant'
    },

    // === Strýcové a tety (Pobočná linie +1) ===
    'f,b': {
      name: 'Strýc (otcův bratr)',
      archaic: 'Strýček, strejda',
      description: 'Bratr tvého otce',
      lineType: 'collateral'
    },
    'f,z': {
      name: 'Teta (otcova sestra)',
      archaic: 'Tetička, staročesky stryna (otcova sestra)',
      description: 'Sestra tvého otce',
      lineType: 'collateral'
    },
    'm,b': {
      name: 'Strýc (matčin bratr)',
      archaic: 'Staročesky ujec',
      description: 'Bratr tvé matky (v historické češtině striktně rozlišován jako ujec)',
      lineType: 'collateral'
    },
    'm,z': {
      name: 'Teta (matčina sestra)',
      archaic: 'Tetička',
      description: 'Sestra tvé matky',
      lineType: 'collateral'
    },
    'f,b,w': {
      name: 'Teta (manželka otcova bratra)',
      archaic: 'Staročesky stryna (žena otcova bratra)',
      description: 'Manželka bratra tvého otce',
      lineType: 'affinity'
    },
    'm,b,w': {
      name: 'Teta (manželka matčina bratra)',
      archaic: 'Staročesky ujčina (žena matčina bratra)',
      description: 'Manželka bratra tvé matky (ujce)',
      lineType: 'affinity'
    },
    'f,z,h': {
      name: 'Strýc (manžel otcovy sestry)',
      archaic: 'Staročesky tetec (muž otcovy sestry)',
      description: 'Manžel sestry tvého otce',
      lineType: 'affinity'
    },
    'm,z,h': {
      name: 'Strýc (manžel matčiny sestry)',
      archaic: 'Staročesky posel (muž matčiny sestry)',
      description: 'Manžel sestry tvé matky',
      lineType: 'affinity'
    },

    // === Prastrýcové a pratety (+2 generace) ===
    'f,f,b': {
      name: 'Prastrýc (dědečkův bratr)',
      archaic: 'Prastrýc',
      description: 'Bratr tvého dědečka',
      lineType: 'collateral'
    },
    'f,f,z': {
      name: 'Prateta (dědečkova sestra)',
      archaic: 'Prateta',
      description: 'Sestra tvého dědečka',
      lineType: 'collateral'
    },
    'f,m,b': {
      name: 'Prastrýc (babiččin bratr)',
      archaic: 'Prastrýc',
      description: 'Bratr tvé babičky',
      lineType: 'collateral'
    },
    'f,m,z': {
      name: 'Prateta (babiččina sestra)',
      archaic: 'Prateta',
      description: 'Sestra tvé babičky',
      lineType: 'collateral'
    },
    'm,f,b': {
      name: 'Prastrýc (dědečkův bratr z matčiny strany)',
      archaic: 'Prastrýc / praujec',
      description: 'Bratr matčina otce',
      lineType: 'collateral'
    },
    'm,f,z': {
      name: 'Prateta (dědečkova sestra z matčiny strany)',
      archaic: 'Prateta',
      description: 'Sestra matčina otce',
      lineType: 'collateral'
    },
    'm,m,b': {
      name: 'Prastrýc (babiččin bratr z matčiny strany)',
      archaic: 'Prastrýc / praujec',
      description: 'Bratr matčiny matky',
      lineType: 'collateral'
    },
    'm,m,z': {
      name: 'Prateta (babiččina sestra z matčiny strany)',
      archaic: 'Prateta',
      description: 'Sestra matčiny matky',
      lineType: 'collateral'
    },

    // === Bratranci a sestřenice (Stejná generace) ===
    'f,b,s': {
      name: 'Bratranec (otcova bratra syn)',
      archaic: 'Staročesky strýčenec, bratran, bratřec, bratřenec',
      description: 'Syn otcova bratra (strýce)',
      lineType: 'collateral'
    },
    'f,b,d': {
      name: 'Sestřenice (otcova bratra dcera)',
      archaic: 'Staročesky strýčena, strýčenice, bratrana',
      description: 'Dcera otcova bratra (strýce)',
      lineType: 'collateral'
    },
    'm,b,s': {
      name: 'Bratranec (matčina bratra syn)',
      archaic: 'Staročesky ujčen, ujčenec',
      description: 'Syn matčina bratra (ujce)',
      lineType: 'collateral'
    },
    'm,b,d': {
      name: 'Sestřenice (matčina bratra dcera)',
      archaic: 'Staročesky ujčena, ujčenice',
      description: 'Dcera matčina bratra (ujce)',
      lineType: 'collateral'
    },
    'f,z,s': {
      name: 'Bratranec (otcovy sestry syn)',
      archaic: 'Staročesky tetěnec, tetčic, sestrovec',
      description: 'Syn otcovy sestry (tety)',
      lineType: 'collateral'
    },
    'f,z,d': {
      name: 'Sestřenice (otcovy sestry dcera)',
      archaic: 'Staročesky tetěnice, tetěna',
      description: 'Dcera otcovy sestry (tety)',
      lineType: 'collateral'
    },
    'm,z,s': {
      name: 'Bratranec (matčiny sestry syn)',
      archaic: 'Staročesky tetěnec, tetčic, sestrovec',
      description: 'Syn matčiny sestry (tety)',
      lineType: 'collateral'
    },
    'm,z,d': {
      name: 'Sestřenice (matčiny sestry dcera)',
      archaic: 'Staročesky tetěnice, tetěna',
      description: 'Dcera matčiny sestry (tety)',
      lineType: 'collateral'
    },

    // Bratranci z druhého kolene
    'f,f,b,s,s': {
      name: 'Bratranec z 2. kolene (druhý bratranec)',
      archaic: 'Staročesky vlastník, vlastně, stříník',
      description: 'Vnuk prastrýce, mají společné prarodiče',
      lineType: 'collateral'
    },
    'f,f,b,s,d': {
      name: 'Sestřenice z 2. kolene (druhá sestřenice)',
      archaic: 'Staročesky vlastnice, vlastně, střínice',
      description: 'Vnučka prastrýce, mají společné prarodiče',
      lineType: 'collateral'
    },
    'f,b,s,s': {
      name: 'Syn bratrance (bratranec z 2. kolene mladší gen.)',
      archaic: 'Druhý bratranec sestupně',
      description: 'Syn tvého bratrance',
      lineType: 'collateral'
    },
    'f,b,s,d': {
      name: 'Dcera bratrance (sestřenice z 2. kolene mladší gen.)',
      archaic: 'Druhá sestřenice sestupně',
      description: 'Dcera tvého bratrance',
      lineType: 'collateral'
    },

    // === Synovci a neteře (Potomci sourozenců) ===
    'b,s': {
      name: 'Synovec (bratrův syn)',
      archaic: 'Staročesky bratrovec',
      description: 'Syn tvého bratra',
      lineType: 'collateral'
    },
    'b,d': {
      name: 'Neteř (bratrova dcera)',
      archaic: 'Staročesky synovkyně',
      description: 'Dcera tvého bratra',
      lineType: 'collateral'
    },
    'z,s': {
      name: 'Synovec (sestřin syn)',
      archaic: 'Staročesky sestřenec, potet',
      description: 'Syn tvé sestry',
      lineType: 'collateral'
    },
    'z,d': {
      name: 'Neteř (sestřina dcera)',
      archaic: 'Staročesky neť',
      description: 'Dcera tvé sestry',
      lineType: 'collateral'
    },
    'b,s,s': {
      name: 'Prasynovec',
      archaic: 'Vnuk bratra',
      description: 'Syn tvého synovce',
      lineType: 'collateral'
    },
    'b,s,d': {
      name: 'Praneteř',
      archaic: 'Vnučka bratra',
      description: 'Dcera tvého synovce',
      lineType: 'collateral'
    },
    'z,s,s': {
      name: 'Prasynovec',
      archaic: 'Vnuk sestry',
      description: 'Syn tvého synovce od sestry',
      lineType: 'collateral'
    },
    'z,s,d': {
      name: 'Praneteř',
      archaic: 'Vnučka sestry',
      description: 'Dcera tvého synovce od sestry',
      lineType: 'collateral'
    },

    // === Sňatek a sešvagření (Affinity) ===
    'h': {
      name: 'Manžel',
      archaic: 'Muž, choť',
      description: 'Tvůj mužský manželský partner',
      lineType: 'affinity'
    },
    'w': {
      name: 'Manželka',
      archaic: 'Žena, choť',
      description: 'Tvůj ženský manželský partner',
      lineType: 'affinity'
    },

    // Rodiče partnera (Tchán a tchyně)
    'w,f': {
      name: 'Tchán (manželčin otec)',
      archaic: 'Staročesky test, švekr',
      description: 'Otec tvé manželky',
      lineType: 'affinity'
    },
    'w,m': {
      name: 'Tchyně (manželčina matka)',
      archaic: 'Staročesky testa, švekruše',
      description: 'Matka tvé manželky',
      lineType: 'affinity'
    },
    'h,f': {
      name: 'Tchán (manželův otec)',
      archaic: 'Staročesky test, švekr',
      description: 'Otec tvého manžela',
      lineType: 'affinity'
    },
    'h,m': {
      name: 'Tchyně (manželova matka)',
      archaic: 'Staročesky testa, švekruše',
      description: 'Matka tvého manžela',
      lineType: 'affinity'
    },
    'w,f,f': {
      name: 'Pratchán',
      archaic: 'Dědeček tvé manželky',
      description: 'Otec tvého tchána',
      lineType: 'affinity'
    },
    'w,f,m': {
      name: 'Pratchyně',
      archaic: 'Babička tvé manželky',
      description: 'Matka tvého tchána',
      lineType: 'affinity'
    },
    'h,f,f': {
      name: 'Pratchán',
      archaic: 'Dědeček tvého manžela',
      description: 'Otec tvého tchána',
      lineType: 'affinity'
    },
    'h,f,m': {
      name: 'Pratchyně',
      archaic: 'Babička tvého manžela',
      description: 'Matka tvého tchána',
      lineType: 'affinity'
    },

    // Švagři a švagrové
    'b,w': {
      name: 'Švagrová (bratrova žena)',
      archaic: 'Staročesky bratřina',
      description: 'Manželka tvého bratra',
      lineType: 'affinity'
    },
    'z,h': {
      name: 'Švagr (sestřin muž)',
      archaic: 'Staročesky svokr, švakr, domácky švára',
      description: 'Manžel tvé sestry',
      lineType: 'affinity'
    },
    'w,b': {
      name: 'Švagr (manželčin bratr)',
      archaic: 'Staročesky šurin, stč. šir/sír',
      description: 'Bratr tvé manželky (v historické češtině specificky zván šurin)',
      lineType: 'affinity'
    },
    'w,z': {
      name: 'Švagrová (manželčina sestra)',
      archaic: 'Staročesky zelva, zelvice',
      description: 'Sestra tvé manželky (v historické češtině specificky zvána zelva)',
      lineType: 'affinity'
    },
    'h,b': {
      name: 'Švagr (manželův bratr)',
      archaic: 'Staročesky deveř',
      description: 'Bratr tvého manžela (v historické češtině specificky zván deveř)',
      lineType: 'affinity'
    },
    'h,z': {
      name: 'Švagrová (manželova sestra)',
      archaic: 'Švagrová',
      description: 'Sestra tvého manžela',
      lineType: 'affinity'
    },
    'w,b,w': {
      name: 'Švagrová (manželka švagra)',
      archaic: 'Švagrová',
      description: 'Manželka bratra tvé manželky',
      lineType: 'affinity'
    },
    'w,z,h': {
      name: 'Švagr (manžel švagrové)',
      archaic: 'Švagr',
      description: 'Manžel sestry tvé manželky',
      lineType: 'affinity'
    },
    'h,b,w': {
      name: 'Švagrová',
      archaic: 'Švagrová',
      description: 'Manželka bratra tvého manžela',
      lineType: 'affinity'
    },
    'h,z,h': {
      name: 'Švagr',
      archaic: 'Švagr',
      description: 'Manžel sestry tvého manžela',
      lineType: 'affinity'
    },

    // Partneři dětí (Snacha a zeť)
    's,w': {
      name: 'Snacha',
      archaic: 'Nevěsta (obecně přivdaná žena)',
      description: 'Manželka tvého syna',
      lineType: 'affinity'
    },
    'd,h': {
      name: 'Zeť',
      archaic: 'Svak (obecně přiženěný muž)',
      description: 'Manžel tvé dcery',
      lineType: 'affinity'
    },
    's,s,w': {
      name: 'Prasnacha',
      archaic: 'Manželka vnuka',
      description: 'Manželka tvého vnuka',
      lineType: 'affinity'
    },
    'd,d,h': {
      name: 'Prazeť',
      archaic: 'Manžel vnučky',
      description: 'Manžel tvé vnučky',
      lineType: 'affinity'
    },
    's,d,h': {
      name: 'Prazeť',
      archaic: 'Manžel vnučky (dcery syna)',
      description: 'Manžel dcery tvého syna',
      lineType: 'affinity'
    },
    's,s,h': {
      name: 'Prazeť',
      archaic: 'Manžel vnuka (ve stejnopohlavním svazku)',
      description: 'Manžel tvého vnuka',
      lineType: 'affinity'
    },
    's,d,w': {
      name: 'Prasnacha',
      archaic: 'Manželka vnučky',
      description: 'Manželka dcery tvého syna',
      lineType: 'affinity'
    },
    'd,d,w': {
      name: 'Prasnacha',
      archaic: 'Manželka vnučky',
      description: 'Manželka dcery tvé dcery',
      lineType: 'affinity'
    },
    'f,z,d,s': {
      name: 'Synovec z 2. kolena',
      archaic: 'Prasynovec z matčiny strany',
      description: 'Vnuk sestry tvého otce',
      lineType: 'collateral'
    },
    'f,z,d,d': {
      name: 'Neteř z 2. kolena',
      archaic: 'Praneteř z matčiny strany',
      description: 'Vnučka sestry tvého otce',
      lineType: 'collateral'
    },
    'w,m,f': {
      name: 'Pratchán',
      archaic: 'Dědeček manželky (otec tchyně)',
      description: 'Otec matky tvé manželky',
      lineType: 'affinity'
    },
    'w,m,m': {
      name: 'Pratchyně',
      archaic: 'Babička manželky (matka tchyně)',
      description: 'Matka matky tvé manželky',
      lineType: 'affinity'
    },

    // Strýcové a tety z druhého kolena (bratranci/sestřenice rodičů)
    'f,f,b,s': {
      name: 'Strýc z 2. kolena',
      archaic: 'Prastrýčenec (bratranec otce)',
      description: 'Syn bratra tvého dědečka (bratranec tvého otce)',
      lineType: 'collateral'
    },
    'f,f,b,d': {
      name: 'Teta z 2. kolena',
      archaic: 'Prasestřenice (sestřenice otce)',
      description: 'Dcera bratra tvého dědečka (sestřenice tvého otce)',
      lineType: 'collateral'
    },
    'm,m,b,s': {
      name: 'Strýc z 2. kolena',
      archaic: 'Prastrýčenec (bratranec matky)',
      description: 'Syn bratra tvé babičky (bratranec tvé matky)',
      lineType: 'collateral'
    },
    'm,m,b,d': {
      name: 'Teta z 2. kolena',
      archaic: 'Prasestřenice (sestřenice matky)',
      description: 'Dcera bratra tvé babičky (sestřenice tvé matky)',
      lineType: 'collateral'
    },

    // Partneři nevlastních rodičů (jiný manžel macechy / jiná manželka otčíma)
    'step_m,h': {
      name: 'Manžel macechy',
      archaic: 'Nový/další manžel macechy',
      description: 'Nový manžel tvé macechy (žádné biologické příbuzenství)',
      lineType: 'step'
    },
    'step_m,step_h': {
      name: 'Manžel macechy',
      archaic: 'Nový manžel macechy',
      description: 'Nový manžel tvé macechy (žádné biologické příbuzenství)',
      lineType: 'step'
    },
    'step_f,w': {
      name: 'Manželka otčíma',
      archaic: 'Nová/další manželka otčíma',
      description: 'Nová manželka tvého otčíma (žádné biologické příbuzenství)',
      lineType: 'step'
    },
    'step_f,step_w': {
      name: 'Manželka otčíma',
      archaic: 'Nová manželka otčíma',
      description: 'Nová manželka tvého otčíma (žádné biologické příbuzenství)',
      lineType: 'step'
    },

    // Vzájemné doplňkové sešvagření (včetně stejnopohlavních párů)
    'd,w': {
      name: 'Snacha',
      archaic: 'Přivdaná partnerka dcery',
      description: 'Manželka tvé dcery',
      lineType: 'affinity'
    },
    's,h': {
      name: 'Zeť',
      archaic: 'Přiženěný partner syna',
      description: 'Manžel tvého syna',
      lineType: 'affinity'
    },
    'z,w': {
      name: 'Švagrová',
      archaic: 'Manželka sestry',
      description: 'Manželka tvé sestry',
      lineType: 'affinity'
    },
    'b,h': {
      name: 'Švagr',
      archaic: 'Manžel bratra',
      description: 'Manžel tvého bratra',
      lineType: 'affinity'
    },
    'h,z,w': {
      name: 'Švagrová',
      archaic: 'Manželka švagrové',
      description: 'Manželka sestry tvého manžela',
      lineType: 'affinity'
    },
    'w,z,w': {
      name: 'Švagrová',
      archaic: 'Manželka švagrové',
      description: 'Manželka sestry tvé manželky',
      lineType: 'affinity'
    },
    'h,b,h': {
      name: 'Švagr',
      archaic: 'Manžel švagra',
      description: 'Manžel bratra tvého manžela',
      lineType: 'affinity'
    },
    'w,b,h': {
      name: 'Švagr',
      archaic: 'Manžel švagra',
      description: 'Manžel bratra tvé manželky',
      lineType: 'affinity'
    },

    // Rodiče partnerů dětí (Svat a svatka)
    's,w,f': {
      name: 'Svat (otec snachy)',
      archaic: 'Starosvat',
      description: 'Otec manželky tvého syna',
      lineType: 'affinity'
    },
    's,w,m': {
      name: 'Svatka (matka snachy)',
      archaic: 'Starosvatka',
      description: 'Matka manželky tvého syna',
      lineType: 'affinity'
    },
    'd,h,f': {
      name: 'Svat (otec zetě)',
      archaic: 'Starosvat',
      description: 'Otec manžela tvé dcery',
      lineType: 'affinity'
    },
    'd,h,m': {
      name: 'Svatka (matka zetě)',
      archaic: 'Starosvatka',
      description: 'Matka manžela tvé dcery',
      lineType: 'affinity'
    }
  }
};
