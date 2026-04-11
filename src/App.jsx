import React, { useEffect, useMemo, useState } from "react";

const WORKER_URL = "https://gemini-proxy.pezzalialessandro.workers.dev";

const LANGUAGES = [
  { code: "it", flag: "🇮🇹", label: "Italiano" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "sq", flag: "🇦🇱", label: "Shqip" },
  { code: "ro", flag: "🇷🇴", label: "Română" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

const TRANSLATIONS = {
  it: {
    subtitle: "Stai per scoprire come l'AI configura un'officina in 2 minuti.",
    step: "Step", of: "di", next: "Avanti", back: "Indietro",
    generate: "Genera configurazione", generating: "Generazione...",
    editData: "Modifica dati", copyText: "Copia testo", openWhatsApp: "Apri WhatsApp", newConfig: "Nuova configurazione",
    catalogError: "Errore caricamento catalogo.", noResult: "Nessun risultato disponibile.",
    s1_title: "1. Attività", s1_tipo: "Tipo attività", s1_business: "Business prevalente",
    s2_title: "2. Veicoli trattati", s3_title: "3. Volume di lavoro", s3_veicoli: "Veicoli al giorno", s3_gomme: "Gomme al giorno",
    s4_title: "4. Servizi e specializzazioni", s4_servizi: "Servizi richiesti", s4_spec: "Specializzazioni",
    s5_title: "5. Officina", s5_spazio: "Spazio officina", s5_pav: "Pavimentazione", s5_op: "Livello operatore",
    s6_title: "6. Preferenze auto / truck", s6_monitor: "Equilibratrice auto: preferenza monitor", s6_lock: "Equilibratrice auto: preferenza bloccaggio",
    s6_fascia: "Smontagomme truck: fascia desiderata", s6_eq: "Equilibratrice truck: livello",
    s7_title: "7. Priorità e note", s7_priorita: "Priorità cliente", s7_leverless: "Richiede leverless",
    s7_assetto: "Richiede assetto", s7_gabbia: "Richiede gabbia gonfiaggio", s7_note: "Note cliente",
    s7_placeholder: "Es. Necessità di smontagomme truck e gabbia gonfiaggio. Budget contenuto.",
    s8_title: "8. Configurazione pronta", profilo: "Profilo officina", classe_volume: "Classe volume",
    linea_auto: "Linea auto", linea_truck: "Linea truck", note_op: "Note operative", domande: "Domande successive",
    codice: "Codice", modello: "Modello", descr_csv: "Descrizione CSV", dettagli: "Dettagli", differenze: "Differenze", motivo: "Motivo",
    smontagomme: "Smontagomme", equilibratrice: "Equilibratrice", gabbia_gonfiaggio: "Gabbia gonfiaggio",
    accessori: "Accessori", nome: "Nome", sollevatori: "Sollevatori consigliati",
    base: "Base", consigliata: "Consigliata", premium: "Premium", seleziona: "Seleziona", da_valutare: "Da valutare", nessuna_pref: "Nessuna preferenza",
    opt_gommista: "Gommista", opt_officina: "Officina meccanica", opt_centro: "Centro completo",
    opt_auto: "Auto", opt_auto_suv: "Auto + SUV", opt_truck: "Truck", opt_misto: "Misto", opt_suv: "SUV", opt_heavy: "Heavy duty",
    opt_smontagomme: "Smontagomme", opt_equilibratura: "Equilibratura", opt_assetto: "Assetto ruote", opt_sollevamento: "Sollevamento", opt_gonfiaggio: "Gabbia / gonfiaggio",
    opt_runflat: "Runflat", opt_ribassati: "Ribassati", opt_rapido: "Servizio rapido", opt_premium_cl: "Clientela premium",
    opt_piccolo: "Piccolo", opt_medio: "Medio", opt_grande: "Grande", opt_industriale: "Industriale", opt_non_ind: "Non industriale",
    opt_base: "Base", opt_esperto: "Esperto", opt_senza_monitor: "Senza monitor", opt_con_monitor: "Con monitor", opt_touch: "Touch",
    opt_galletto: "Galletto standard", opt_ghiera: "Ghiera rapida", opt_nls: "NLS pneumatico",
    opt_entry: "Entry level fino a 26\"", opt_mid: "Fascia media / 56\"", opt_prof: "Professionale",
    opt_auto_data: "Con acquisizione automatica dati", opt_top_rlc: "Top con RLC",
    opt_risparmio: "Risparmio", opt_produttivita: "Produttività", opt_ergonomia: "Ergonomia", opt_immagine: "Immagine officina",
    copied: "Testo copiato negli appunti.", copy_error: "Impossibile copiare automaticamente.", da_definire: "da definire",
    portata: "Portata", altezza_min: "Altezza minima", alimentazione: "Alimentazione", note_sollevatore: "Note",
  },
  en: {
    subtitle: "Discover how AI configures a workshop in 2 minutes.",
    step: "Step", of: "of", next: "Next", back: "Back",
    generate: "Generate configuration", generating: "Generating...",
    editData: "Edit data", copyText: "Copy text", openWhatsApp: "Open WhatsApp", newConfig: "New configuration",
    catalogError: "Error loading catalog.", noResult: "No result available.",
    s1_title: "1. Activity", s1_tipo: "Activity type", s1_business: "Main business",
    s2_title: "2. Vehicle types", s3_title: "3. Work volume", s3_veicoli: "Vehicles per day", s3_gomme: "Tyres per day",
    s4_title: "4. Services & specializations", s4_servizi: "Required services", s4_spec: "Specializations",
    s5_title: "5. Workshop", s5_spazio: "Workshop space", s5_pav: "Flooring", s5_op: "Operator level",
    s6_title: "6. Car / truck preferences", s6_monitor: "Balancer: monitor preference", s6_lock: "Balancer: clamping preference",
    s6_fascia: "Truck tyre changer: range", s6_eq: "Truck balancer: level",
    s7_title: "7. Priorities & notes", s7_priorita: "Customer priority", s7_leverless: "Requires leverless",
    s7_assetto: "Requires wheel alignment", s7_gabbia: "Requires inflation cage", s7_note: "Customer notes",
    s7_placeholder: "E.g. Need truck tyre changer and inflation cage. Tight budget.",
    s8_title: "8. Configuration ready", profilo: "Workshop profile", classe_volume: "Volume class",
    linea_auto: "Car line", linea_truck: "Truck line", note_op: "Operational notes", domande: "Follow-up questions",
    codice: "Code", modello: "Model", descr_csv: "CSV description", dettagli: "Details", differenze: "Differences", motivo: "Reason",
    smontagomme: "Tyre changer", equilibratrice: "Wheel balancer", gabbia_gonfiaggio: "Inflation cage",
    accessori: "Accessories", nome: "Name", sollevatori: "Recommended lifts",
    base: "Basic", consigliata: "Recommended", premium: "Premium", seleziona: "Select", da_valutare: "To evaluate", nessuna_pref: "No preference",
    opt_gommista: "Tyre shop", opt_officina: "Mechanical workshop", opt_centro: "Full service centre",
    opt_auto: "Car", opt_auto_suv: "Car + SUV", opt_truck: "Truck", opt_misto: "Mixed", opt_suv: "SUV", opt_heavy: "Heavy duty",
    opt_smontagomme: "Tyre changer", opt_equilibratura: "Wheel balancing", opt_assetto: "Wheel alignment", opt_sollevamento: "Lifting", opt_gonfiaggio: "Cage / inflation",
    opt_runflat: "Runflat", opt_ribassati: "Low profile", opt_rapido: "Fast service", opt_premium_cl: "Premium customers",
    opt_piccolo: "Small", opt_medio: "Medium", opt_grande: "Large", opt_industriale: "Industrial", opt_non_ind: "Non-industrial",
    opt_base: "Basic", opt_esperto: "Expert", opt_senza_monitor: "Without monitor", opt_con_monitor: "With monitor", opt_touch: "Touch",
    opt_galletto: "Standard nut", opt_ghiera: "Quick ring", opt_nls: "Pneumatic NLS",
    opt_entry: "Entry level up to 26\"", opt_mid: "Mid range / 56\"", opt_prof: "Professional",
    opt_auto_data: "With automatic data acquisition", opt_top_rlc: "Top with RLC",
    opt_risparmio: "Savings", opt_produttivita: "Productivity", opt_ergonomia: "Ergonomics", opt_immagine: "Workshop image",
    copied: "Text copied to clipboard.", copy_error: "Unable to copy automatically.", da_definire: "to be defined",
    portata: "Capacity", altezza_min: "Min height", alimentazione: "Power supply", note_sollevatore: "Notes",
  },
  de: {
    subtitle: "Entdecken Sie, wie KI eine Werkstatt in 2 Minuten konfiguriert.",
    step: "Schritt", of: "von", next: "Weiter", back: "Zurück",
    generate: "Konfiguration erstellen", generating: "Erstelle...",
    editData: "Daten bearbeiten", copyText: "Text kopieren", openWhatsApp: "WhatsApp öffnen", newConfig: "Neue Konfiguration",
    catalogError: "Fehler beim Laden des Katalogs.", noResult: "Kein Ergebnis verfügbar.",
    s1_title: "1. Tätigkeit", s1_tipo: "Tätigkeitstyp", s1_business: "Hauptgeschäft",
    s2_title: "2. Fahrzeugtypen", s3_title: "3. Arbeitsvolumen", s3_veicoli: "Fahrzeuge pro Tag", s3_gomme: "Reifen pro Tag",
    s4_title: "4. Dienstleistungen", s4_servizi: "Benötigte Dienste", s4_spec: "Spezialisierungen",
    s5_title: "5. Werkstatt", s5_spazio: "Werkstattgröße", s5_pav: "Bodenbelag", s5_op: "Bedienerebene",
    s6_title: "6. PKW / LKW Einstellungen", s6_monitor: "Auswuchtmaschine: Monitor", s6_lock: "Auswuchtmaschine: Spannung",
    s6_fascia: "LKW-Reifenmontiergerät: Bereich", s6_eq: "LKW-Auswuchtmaschine: Niveau",
    s7_title: "7. Prioritäten & Notizen", s7_priorita: "Kundenpriorität", s7_leverless: "Hebellos erforderlich",
    s7_assetto: "Spureinstellung erforderlich", s7_gabbia: "Aufpumpkäfig erforderlich", s7_note: "Kundennotizen",
    s7_placeholder: "Z.B. LKW-Reifenmontiergerät benötigt. Knappes Budget.",
    s8_title: "8. Konfiguration fertig", profilo: "Werkstattprofil", classe_volume: "Volumenklasse",
    linea_auto: "PKW-Linie", linea_truck: "LKW-Linie", note_op: "Betriebshinweise", domande: "Folgefragen",
    codice: "Code", modello: "Modell", descr_csv: "CSV-Beschreibung", dettagli: "Details", differenze: "Unterschiede", motivo: "Grund",
    smontagomme: "Reifenmontiergerät", equilibratrice: "Auswuchtmaschine", gabbia_gonfiaggio: "Aufpumpkäfig",
    accessori: "Zubehör", nome: "Name", sollevatori: "Empfohlene Hebebühnen",
    base: "Basis", consigliata: "Empfohlen", premium: "Premium", seleziona: "Auswählen", da_valutare: "Zu bewerten", nessuna_pref: "Keine Präferenz",
    opt_gommista: "Reifenwerkstatt", opt_officina: "Mechanische Werkstatt", opt_centro: "Vollservice-Center",
    opt_auto: "PKW", opt_auto_suv: "PKW + SUV", opt_truck: "LKW", opt_misto: "Gemischt", opt_suv: "SUV", opt_heavy: "Schwerlast",
    opt_smontagomme: "Reifenmontage", opt_equilibratura: "Auswuchten", opt_assetto: "Spureinstellung", opt_sollevamento: "Heben", opt_gonfiaggio: "Käfig / Aufpumpen",
    opt_runflat: "Runflat", opt_ribassati: "Niederquerschnitt", opt_rapido: "Schnellservice", opt_premium_cl: "Premium-Kunden",
    opt_piccolo: "Klein", opt_medio: "Mittel", opt_grande: "Groß", opt_industriale: "Industriell", opt_non_ind: "Nicht industriell",
    opt_base: "Basis", opt_esperto: "Experte", opt_senza_monitor: "Ohne Monitor", opt_con_monitor: "Mit Monitor", opt_touch: "Touch",
    opt_galletto: "Standardmutter", opt_ghiera: "Schnellring", opt_nls: "Pneumatisches NLS",
    opt_entry: "Einstieg bis 26\"", opt_mid: "Mittelklasse / 56\"", opt_prof: "Professionell",
    opt_auto_data: "Mit automatischer Datenerfassung", opt_top_rlc: "Top mit RLC",
    opt_risparmio: "Sparen", opt_produttivita: "Produktivität", opt_ergonomia: "Ergonomie", opt_immagine: "Werkstattimage",
    copied: "Text kopiert.", copy_error: "Automatisches Kopieren nicht möglich.", da_definire: "zu definieren",
    portata: "Tragfähigkeit", altezza_min: "Mindesthöhe", alimentazione: "Stromversorgung", note_sollevatore: "Hinweise",
  },
  sq: {
    subtitle: "Zbuloni si AI konfiguron një punishte në 2 minuta.",
    step: "Hapi", of: "nga", next: "Tjetër", back: "Mbrapa",
    generate: "Gjenero konfigurimin", generating: "Duke gjeneruar...",
    editData: "Ndrysho të dhënat", copyText: "Kopjo tekstin", openWhatsApp: "Hap WhatsApp", newConfig: "Konfigurim i ri",
    catalogError: "Gabim gjatë ngarkimit të katalogut.", noResult: "Nuk ka rezultat.",
    s1_title: "1. Aktiviteti", s1_tipo: "Lloji i aktivitetit", s1_business: "Biznesi kryesor",
    s2_title: "2. Llojet e mjeteve", s3_title: "3. Vëllimi i punës", s3_veicoli: "Mjete në ditë", s3_gomme: "Goma në ditë",
    s4_title: "4. Shërbime & specializime", s4_servizi: "Shërbimet e kërkuara", s4_spec: "Specializime",
    s5_title: "5. Punishte", s5_spazio: "Hapësira", s5_pav: "Dyshemeja", s5_op: "Niveli i operatorit",
    s6_title: "6. Preferencat auto / kamion", s6_monitor: "Ekuilibrues: monitor", s6_lock: "Ekuilibrues: bllokimi",
    s6_fascia: "Ndërrues gomash kamion: niveli", s6_eq: "Ekuilibrues kamion: niveli",
    s7_title: "7. Prioritetet & shënime", s7_priorita: "Prioriteti i klientit", s7_leverless: "Kërkon pa levë",
    s7_assetto: "Kërkon rregullim rrotash", s7_gabbia: "Kërkon kafaz fryrjeje", s7_note: "Shënime klienti",
    s7_placeholder: "P.sh. Nevojitet ndërrues gomash kamioni. Buxhet i kufizuar.",
    s8_title: "8. Konfigurimi gati", profilo: "Profili i punishtes", classe_volume: "Klasa e vëllimit",
    linea_auto: "Linja auto", linea_truck: "Linja kamion", note_op: "Shënime operative", domande: "Pyetje vijuese",
    codice: "Kodi", modello: "Modeli", descr_csv: "Përshkrim CSV", dettagli: "Detaje", differenze: "Ndryshime", motivo: "Arsyeja",
    smontagomme: "Ndërrues gomash", equilibratrice: "Ekuilibrues", gabbia_gonfiaggio: "Kafaz fryrjeje",
    accessori: "Aksesore", nome: "Emri", sollevatori: "Ngritës të rekomanduar",
    base: "Bazë", consigliata: "E rekomanduar", premium: "Premium", seleziona: "Zgjidh", da_valutare: "Për t'u vlerësuar", nessuna_pref: "Asnjë preferencë",
    opt_gommista: "Vulkanizim", opt_officina: "Punishte mekanike", opt_centro: "Qendër e plotë",
    opt_auto: "Auto", opt_auto_suv: "Auto + SUV", opt_truck: "Kamion", opt_misto: "I përzier", opt_suv: "SUV", opt_heavy: "Ngarkesa të rënda",
    opt_smontagomme: "Ndërrues gomash", opt_equilibratura: "Ekuilibrimi", opt_assetto: "Rregullim rrotash", opt_sollevamento: "Ngritje", opt_gonfiaggio: "Kafaz / fryrje",
    opt_runflat: "Runflat", opt_ribassati: "Profil i ulët", opt_rapido: "Shërbim i shpejtë", opt_premium_cl: "Klientë premium",
    opt_piccolo: "I vogël", opt_medio: "Mesatar", opt_grande: "I madh", opt_industriale: "Industrial", opt_non_ind: "Jo industrial",
    opt_base: "Bazë", opt_esperto: "Ekspert", opt_senza_monitor: "Pa monitor", opt_con_monitor: "Me monitor", opt_touch: "Touch",
    opt_galletto: "Dado standarde", opt_ghiera: "Unazë e shpejtë", opt_nls: "NLS pneumatik",
    opt_entry: "Hyrje deri 26\"", opt_mid: "Mesatar / 56\"", opt_prof: "Profesional",
    opt_auto_data: "Me blerje automatike të të dhënave", opt_top_rlc: "Top me RLC",
    opt_risparmio: "Kursim", opt_produttivita: "Produktivitet", opt_ergonomia: "Ergonomi", opt_immagine: "Imazhi i punishtes",
    copied: "Teksti u kopjua.", copy_error: "Kopjimi automatik i pamundur.", da_definire: "për t'u përcaktuar",
    portata: "Kapaciteti", altezza_min: "Lartësia min", alimentazione: "Furnizimi", note_sollevatore: "Shënime",
  },
  ro: {
    subtitle: "Descoperiți cum AI configurează un atelier în 2 minute.",
    step: "Pasul", of: "din", next: "Înainte", back: "Înapoi",
    generate: "Generează configurația", generating: "Se generează...",
    editData: "Modifică datele", copyText: "Copiază textul", openWhatsApp: "Deschide WhatsApp", newConfig: "Configurație nouă",
    catalogError: "Eroare la încărcarea catalogului.", noResult: "Niciun rezultat disponibil.",
    s1_title: "1. Activitate", s1_tipo: "Tipul activității", s1_business: "Afacerea principală",
    s2_title: "2. Tipuri de vehicule", s3_title: "3. Volum de lucru", s3_veicoli: "Vehicule pe zi", s3_gomme: "Anvelope pe zi",
    s4_title: "4. Servicii & specializări", s4_servizi: "Servicii solicitate", s4_spec: "Specializări",
    s5_title: "5. Atelier", s5_spazio: "Spațiu atelier", s5_pav: "Pardoseală", s5_op: "Nivelul operatorului",
    s6_title: "6. Preferințe auto / camion", s6_monitor: "Echilibrator: monitor", s6_lock: "Echilibrator: blocare",
    s6_fascia: "Mașină montare anvelope camion: nivel", s6_eq: "Echilibrator camion: nivel",
    s7_title: "7. Priorități & note", s7_priorita: "Prioritatea clientului", s7_leverless: "Necesită fără levier",
    s7_assetto: "Necesită geometrie roți", s7_gabbia: "Necesită colivie umflare", s7_note: "Note client",
    s7_placeholder: "Ex. Necesită mașină montare anvelope camion. Buget limitat.",
    s8_title: "8. Configurație gata", profilo: "Profilul atelierului", classe_volume: "Clasa de volum",
    linea_auto: "Linie auto", linea_truck: "Linie camion", note_op: "Note operative", domande: "Întrebări ulterioare",
    codice: "Cod", modello: "Model", descr_csv: "Descriere CSV", dettagli: "Detalii", differenze: "Diferențe", motivo: "Motiv",
    smontagomme: "Mașină montare anvelope", equilibratrice: "Echilibrator", gabbia_gonfiaggio: "Colivie umflare",
    accessori: "Accesorii", nome: "Nume", sollevatori: "Ridicătoare recomandate",
    base: "De bază", consigliata: "Recomandat", premium: "Premium", seleziona: "Selectează", da_valutare: "De evaluat", nessuna_pref: "Nicio preferință",
    opt_gommista: "Vulcanizare", opt_officina: "Atelier mecanic", opt_centro: "Centru complet",
    opt_auto: "Auto", opt_auto_suv: "Auto + SUV", opt_truck: "Camion", opt_misto: "Mixt", opt_suv: "SUV", opt_heavy: "Transport greu",
    opt_smontagomme: "Montare anvelope", opt_equilibratura: "Echilibrare", opt_assetto: "Geometrie roți", opt_sollevamento: "Ridicare", opt_gonfiaggio: "Colivie / umflare",
    opt_runflat: "Runflat", opt_ribassati: "Profil jos", opt_rapido: "Service rapid", opt_premium_cl: "Clienți premium",
    opt_piccolo: "Mic", opt_medio: "Mediu", opt_grande: "Mare", opt_industriale: "Industrial", opt_non_ind: "Non-industrial",
    opt_base: "De bază", opt_esperto: "Expert", opt_senza_monitor: "Fără monitor", opt_con_monitor: "Cu monitor", opt_touch: "Touch",
    opt_galletto: "Piuliță standard", opt_ghiera: "Inel rapid", opt_nls: "NLS pneumatic",
    opt_entry: "Intrare până la 26\"", opt_mid: "Gamă medie / 56\"", opt_prof: "Profesional",
    opt_auto_data: "Cu achiziție automată de date", opt_top_rlc: "Top cu RLC",
    opt_risparmio: "Economie", opt_produttivita: "Productivitate", opt_ergonomia: "Ergonomie", opt_immagine: "Imaginea atelierului",
    copied: "Text copiat.", copy_error: "Copiere automată imposibilă.", da_definire: "de definit",
    portata: "Capacitate", altezza_min: "Înălțime min", alimentazione: "Alimentare", note_sollevatore: "Note",
  },
  zh: {
    subtitle: "了解AI如何在2分钟内配置车间。",
    step: "步骤", of: "/", next: "下一步", back: "返回",
    generate: "生成配置", generating: "生成中...",
    editData: "修改数据", copyText: "复制文本", openWhatsApp: "打开WhatsApp", newConfig: "新配置",
    catalogError: "加载目录时出错。", noResult: "没有可用结果。",
    s1_title: "1. 业务类型", s1_tipo: "活动类型", s1_business: "主要业务",
    s2_title: "2. 车辆类型", s3_title: "3. 工作量", s3_veicoli: "每日车辆数", s3_gomme: "每日轮胎数",
    s4_title: "4. 服务与专业", s4_servizi: "所需服务", s4_spec: "专业化",
    s5_title: "5. 车间", s5_spazio: "车间空间", s5_pav: "地面类型", s5_op: "操作员水平",
    s6_title: "6. 轿车/卡车偏好", s6_monitor: "平衡机：显示器", s6_lock: "平衡机：夹紧",
    s6_fascia: "卡车换胎机：范围", s6_eq: "卡车平衡机：级别",
    s7_title: "7. 优先级与备注", s7_priorita: "客户优先级", s7_leverless: "需要无杆式",
    s7_assetto: "需要四轮定位", s7_gabbia: "需要充气笼", s7_note: "客户备注",
    s7_placeholder: "例如：需要卡车换胎机。预算有限。",
    s8_title: "8. 配置完成", profilo: "车间简介", classe_volume: "工作量级别",
    linea_auto: "轿车系列", linea_truck: "卡车系列", note_op: "操作备注", domande: "后续问题",
    codice: "代码", modello: "型号", descr_csv: "CSV描述", dettagli: "详情", differenze: "差异", motivo: "原因",
    smontagomme: "换胎机", equilibratrice: "平衡机", gabbia_gonfiaggio: "充气笼",
    accessori: "配件", nome: "名称", sollevatori: "推荐举升机",
    base: "基础", consigliata: "推荐", premium: "高级", seleziona: "选择", da_valutare: "待评估", nessuna_pref: "无偏好",
    opt_gommista: "轮胎店", opt_officina: "机械车间", opt_centro: "综合服务中心",
    opt_auto: "轿车", opt_auto_suv: "轿车 + SUV", opt_truck: "卡车", opt_misto: "混合", opt_suv: "SUV", opt_heavy: "重型",
    opt_smontagomme: "换胎", opt_equilibratura: "平衡", opt_assetto: "四轮定位", opt_sollevamento: "举升", opt_gonfiaggio: "充气笼/充气",
    opt_runflat: "缺气保用", opt_ribassati: "低扁平比", opt_rapido: "快速服务", opt_premium_cl: "高端客户",
    opt_piccolo: "小", opt_medio: "中", opt_grande: "大", opt_industriale: "工业地面", opt_non_ind: "非工业地面",
    opt_base: "基础", opt_esperto: "专家", opt_senza_monitor: "无显示器", opt_con_monitor: "有显示器", opt_touch: "触摸屏",
    opt_galletto: "标准螺母", opt_ghiera: "快速环", opt_nls: "气动NLS",
    opt_entry: "入门级至26\"", opt_mid: "中档 / 56\"", opt_prof: "专业级",
    opt_auto_data: "自动数据采集", opt_top_rlc: "顶级含RLC",
    opt_risparmio: "节省", opt_produttivita: "生产效率", opt_ergonomia: "人体工程学", opt_immagine: "车间形象",
    copied: "文本已复制。", copy_error: "无法自动复制。", da_definire: "待定",
    portata: "承重", altezza_min: "最小高度", alimentazione: "电源", note_sollevatore: "备注",
  },
};

const initialForm = {
  tipo_attivita: "", business_prevalente: "", tipologie_veicoli: [],
  volume_veicoli_giorno: "", volume_gomme_giorno: "", servizi_richiesti: [],
  specializzazioni: [], spazio_officina: "", pavimentazione: "", livello_operatore: "",
  priorita_cliente: "", auto_monitor_pref: "", auto_lock_pref: "",
  truck_smonto_fascia: "", truck_eq_level: "", richiede_leverless: false,
  richiede_assetto: false, richiede_gabbia_gonfiaggio: false, note_cliente: ""
};

function cleanJsonResponse(text) {
  let cleaned = String(text || "").trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.replace(/^```json\s*/i, "");
  if (cleaned.startsWith("```")) cleaned = cleaned.replace(/^```\s*/i, "");
  if (cleaned.endsWith("```")) cleaned = cleaned.replace(/\s*```$/, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  return cleaned.trim();
}

function exportCommercialText(result, t) {
  const p = result?.profilo_officina || {};
  const lines = ["OFFICINA AI — CORMACH", "", `${t.profilo}: ${p.sintesi || "-"}`, `${t.classe_volume}: ${p.classe_volume || "-"}`, ""];
  const pushLine = (sectionTitle, line, isTruck = false) => {
    if (!line?.attiva) return;
    lines.push(sectionTitle.toUpperCase());
    [[t.base, line.base], [t.consigliata, line.consigliata], [t.premium, line.premium]].forEach(([label, item]) => {
      lines.push(`${label}:`);
      lines.push(`- ${t.smontagomme}: ${item?.smontagomme?.model || "-"}${item?.smontagomme?.code ? ` (${item.smontagomme.code})` : ""}`);
      lines.push(`- ${t.equilibratrice}: ${item?.equilibratrice?.model || "-"}${item?.equilibratrice?.code ? ` (${item.equilibratrice.code})` : ""}`);
      if (isTruck) lines.push(`- ${t.gabbia_gonfiaggio}: ${item?.gabbia_gonfiaggio?.model || "-"}`);
      lines.push("");
    });
  };
  pushLine(t.linea_auto, result?.linea_auto, false);
  pushLine(t.linea_truck, result?.linea_truck, true);
  if ((result?.sollevatori || []).length) {
    lines.push(`${t.sollevatori}:`);
    result.sollevatori.forEach(s => lines.push(`- ${s.model} (${s.code || "-"}): ${s.motivo || ""}`));
    lines.push("");
  }
  if ((result?.domande_successive || []).length) {
    lines.push(`${t.domande}:`);
    result.domande_successive.forEach(d => lines.push(`- ${d}`));
  }
  return lines.join("\n");
}

export default function App() {
  const [lang, setLang] = useState("it");
  const t = TRANSLATIONS[lang];
  const [step, setStep] = useState(1);
  const [catalogo, setCatalogo] = useState(null);
  const [catalogoError, setCatalogoError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCatalogo = async () => {
      try {
        const res = await fetch(`catalogo-prodotti-cormach-v6.csv-aligned.json`, { cache: "no-store" });
        if (!res.ok) throw new Error(t.catalogError);
        setCatalogo(await res.json());
      } catch (err) { console.error(err); setCatalogoError(t.catalogError); }
    };
    loadCatalogo();
  }, []);

  const progress = useMemo(() => Math.round((step / 8) * 100), [step]);
  const lineTruckActive = form.tipologie_veicoli.includes("truck") || form.tipologie_veicoli.includes("heavy_duty");
  const lineAutoActive = form.tipologie_veicoli.includes("auto") || form.tipologie_veicoli.includes("suv");
  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const toggleArrayValue = (field, value) => setForm(prev => {
    const current = prev[field];
    return { ...prev, [field]: current.includes(value) ? current.filter(x => x !== value) : [...current, value] };
  });
  const resetAll = () => { setForm(initialForm); setResult(null); setError(""); setStep(1); };
  const classifyVolume = (v, g) => {
    const veicoli = Number(v || 0), gomme = Number(g || 0);
    if (veicoli >= 16 || gomme >= 61) return "alto";
    if (veicoli >= 6 || gomme >= 21) return "medio";
    return "basso";
  };
  const validateBeforeGenerate = () => {
    if (!catalogo) return t.catalogError;
    if (!form.tipo_attivita) return t.s1_tipo;
    if (form.tipologie_veicoli.length === 0) return t.s2_title;
    if (form.servizi_richiesti.length === 0) return t.s4_servizi;
    return "";
  };

  const buildPrompt = (inputData, catalogData) => {
    const langName = LANGUAGES.find(l => l.code === lang)?.label || "Italiano";
    const needsLifts = inputData.servizi_richiesti?.includes("sollevamento") || inputData.servizi_richiesti?.includes("assetto_ruote") || inputData.richiede_assetto;
    return `You are a senior Cormach technical-commercial consultant.
IMPORTANT: Respond ENTIRELY in ${langName}. All text fields must be in ${langName}.

HARD CONSTRAINTS:
- No prices. Do not invent codes outside the catalog.
- If input includes auto/SUV and truck/heavy_duty: create TWO DISTINCT BRANCHES linea_auto and linea_truck.
- Follow all auto_lock_pref, auto_monitor_pref, truck_smonto_fascia, truck_eq_level rules strictly.
- SOLLEVATORI: If servizi_richiesti includes "sollevamento" OR "assetto_ruote" OR richiede_assetto=true, you MUST populate the "sollevatori" array with 1-3 recommended lifts from the catalog sections: ponti_forbice_assetto, ponti_forbice_doppia, colonne_mobili. Choose based on vehicle types and workshop space. For assetto_ruote: prefer ponti_forbice_assetto (PFA 40 or PFA 50). For general lifting: prefer ponti_forbice_doppia (L 3100, L 3300, L 3300 EVO, L 3400, L 3500 EVO). For heavy vehicles/trucks: prefer colonne_mobili (WL 85 MOVE). If sollevamento is NOT requested, return "sollevatori": [].

MANDATORY JSON FORMAT (respond with JSON only, no markdown):
{
  "profilo_officina": {"sintesi": "string", "classe_volume": "basso|medio|alto", "misto_auto_truck": false},
  "linea_auto": {"attiva": true, "base": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}, "consigliata": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}, "premium": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}},
  "linea_truck": {"attiva": false, "base": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "gabbia_gonfiaggio": {"necessaria": true,"code":"string","model":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}, "consigliata": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "gabbia_gonfiaggio": {"necessaria": true,"code":"string","model":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}, "premium": {"smontagomme": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "equilibratrice": {"code":"string","model":"string","csv_description":"string","details":["string"],"difference":"string","motivo":"string"}, "gabbia_gonfiaggio": {"necessaria": true,"code":"string","model":"string","details":["string"],"difference":"string","motivo":"string"}, "accessori": []}},
  "sollevatori": [{"code":"string","model":"string","csv_description":"string","portata":"string","altezza_min":"string","alimentazione":"string","details":["string"],"motivo":"string"}],
  "note_operative": ["string"],
  "domande_successive": ["string"]
}

CATALOG: ${JSON.stringify(catalogData, null, 2)}
INPUT: ${JSON.stringify(inputData, null, 2)}`.trim();
  };

  const generateConfiguration = async () => {
    const validationError = validateBeforeGenerate();
    if (validationError) { setError(validationError); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const preparedInput = { ...form, volume_veicoli_giorno: Number(form.volume_veicoli_giorno || 0), volume_gomme_giorno: Number(form.volume_gomme_giorno || 0), classe_volume_stimata: classifyVolume(form.volume_veicoli_giorno, form.volume_gomme_giorno) };
      const response = await fetch(WORKER_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: buildPrompt(preparedInput, catalogo) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Errore Worker.");
      setResult(JSON.parse(cleanJsonResponse(data.result)));
      setStep(8);
    } catch (err) { console.error(err); setError(err.message || "Errore."); }
    finally { setLoading(false); }
  };

  const copyText = async () => {
    if (!result) return;
    try { await navigator.clipboard.writeText(exportCommercialText(result, t)); alert(t.copied); }
    catch { alert(t.copy_error); }
  };
  const openWhatsApp = () => { if (!result) return; window.open(`https://wa.me/?text=${encodeURIComponent(exportCommercialText(result, t))}`, "_blank"); };

  const renderStep = () => {
    switch (step) {
      case 1: return <Section title={t.s1_title}>
        <Field label={t.s1_tipo}><select value={form.tipo_attivita} onChange={e=>updateField("tipo_attivita",e.target.value)}><option value="">{t.seleziona}</option><option value="gommista">{t.opt_gommista}</option><option value="officina_meccanica">{t.opt_officina}</option><option value="centro_completo">{t.opt_centro}</option></select></Field>
        <Field label={t.s1_business}><select value={form.business_prevalente} onChange={e=>updateField("business_prevalente",e.target.value)}><option value="">{t.seleziona}</option><option value="auto">{t.opt_auto}</option><option value="auto_suv">{t.opt_auto_suv}</option><option value="truck">{t.opt_truck}</option><option value="misto">{t.opt_misto}</option></select></Field>
      </Section>;
      case 2: return <Section title={t.s2_title}><CheckboxGroup options={[{value:"auto",label:t.opt_auto},{value:"suv",label:t.opt_suv},{value:"truck",label:t.opt_truck},{value:"heavy_duty",label:t.opt_heavy}]} values={form.tipologie_veicoli} onToggle={v=>toggleArrayValue("tipologie_veicoli",v)} /></Section>;
      case 3: return <Section title={t.s3_title}>
        <Field label={t.s3_veicoli}><input type="number" min="0" value={form.volume_veicoli_giorno} onChange={e=>updateField("volume_veicoli_giorno",e.target.value)} /></Field>
        <Field label={t.s3_gomme}><input type="number" min="0" value={form.volume_gomme_giorno} onChange={e=>updateField("volume_gomme_giorno",e.target.value)} /></Field>
      </Section>;
      case 4: return <Section title={t.s4_title}>
        <Field label={t.s4_servizi}><CheckboxGroup options={[{value:"smontagomme",label:t.opt_smontagomme},{value:"equilibratura",label:t.opt_equilibratura},{value:"assetto_ruote",label:t.opt_assetto},{value:"sollevamento",label:t.opt_sollevamento},{value:"gonfiaggio",label:t.opt_gonfiaggio}]} values={form.servizi_richiesti} onToggle={v=>toggleArrayValue("servizi_richiesti",v)} /></Field>
        <Field label={t.s4_spec}><CheckboxGroup options={[{value:"runflat",label:t.opt_runflat},{value:"ribassati",label:t.opt_ribassati},{value:"servizio_rapido",label:t.opt_rapido},{value:"premium",label:t.opt_premium_cl}]} values={form.specializzazioni} onToggle={v=>toggleArrayValue("specializzazioni",v)} /></Field>
      </Section>;
      case 5: return <Section title={t.s5_title}>
        <Field label={t.s5_spazio}><select value={form.spazio_officina} onChange={e=>updateField("spazio_officina",e.target.value)}><option value="">{t.seleziona}</option><option value="piccolo">{t.opt_piccolo}</option><option value="medio">{t.opt_medio}</option><option value="grande">{t.opt_grande}</option></select></Field>
        <Field label={t.s5_pav}><select value={form.pavimentazione} onChange={e=>updateField("pavimentazione",e.target.value)}><option value="">{t.seleziona}</option><option value="industriale">{t.opt_industriale}</option><option value="non_industriale">{t.opt_non_ind}</option></select></Field>
        <Field label={t.s5_op}><select value={form.livello_operatore} onChange={e=>updateField("livello_operatore",e.target.value)}><option value="">{t.seleziona}</option><option value="base">{t.opt_base}</option><option value="medio">{t.opt_medio}</option><option value="esperto">{t.opt_esperto}</option></select></Field>
      </Section>;
      case 6: return <Section title={t.s6_title}>
        {lineAutoActive && <><Field label={t.s6_monitor}><select value={form.auto_monitor_pref} onChange={e=>updateField("auto_monitor_pref",e.target.value)}><option value="">{t.nessuna_pref}</option><option value="senza_monitor">{t.opt_senza_monitor}</option><option value="con_monitor">{t.opt_con_monitor}</option><option value="touch">{t.opt_touch}</option></select></Field><Field label={t.s6_lock}><select value={form.auto_lock_pref} onChange={e=>updateField("auto_lock_pref",e.target.value)}><option value="">{t.nessuna_pref}</option><option value="galletto_standard">{t.opt_galletto}</option><option value="ghiera_rapida">{t.opt_ghiera}</option><option value="nls">{t.opt_nls}</option></select></Field></>}
        {lineTruckActive && <><Field label={t.s6_fascia}><select value={form.truck_smonto_fascia} onChange={e=>updateField("truck_smonto_fascia",e.target.value)}><option value="">{t.da_valutare}</option><option value="entry_26">{t.opt_entry}</option><option value="mid_56">{t.opt_mid}</option><option value="professional">{t.opt_prof}</option></select></Field><Field label={t.s6_eq}><select value={form.truck_eq_level} onChange={e=>updateField("truck_eq_level",e.target.value)}><option value="">{t.da_valutare}</option><option value="basic">{t.opt_base}</option><option value="auto_data">{t.opt_auto_data}</option><option value="top_rlc">{t.opt_top_rlc}</option></select></Field></>}
      </Section>;
      case 7: return <Section title={t.s7_title}>
        <Field label={t.s7_priorita}><select value={form.priorita_cliente} onChange={e=>updateField("priorita_cliente",e.target.value)}><option value="">{t.seleziona}</option><option value="risparmio">{t.opt_risparmio}</option><option value="produttivita">{t.opt_produttivita}</option><option value="ergonomia">{t.opt_ergonomia}</option><option value="immagine_officina">{t.opt_immagine}</option></select></Field>
        <ToggleRow label={t.s7_leverless} checked={form.richiede_leverless} onChange={v=>updateField("richiede_leverless",v)} />
        <ToggleRow label={t.s7_assetto} checked={form.richiede_assetto} onChange={v=>updateField("richiede_assetto",v)} />
        <ToggleRow label={t.s7_gabbia} checked={form.richiede_gabbia_gonfiaggio} onChange={v=>updateField("richiede_gabbia_gonfiaggio",v)} />
        <Field label={t.s7_note}><textarea rows="5" value={form.note_cliente} onChange={e=>updateField("note_cliente",e.target.value)} placeholder={t.s7_placeholder} /></Field>
      </Section>;
      case 8: return <Section title={t.s8_title}>{result ? <ResultView result={result} t={t} /> : <p>{t.noResult}</p>}</Section>;
      default: return null;
    }
  };

  return (
    <div className="app-shell">
      <div className="container">
        <header className="hero">
          <h1>OfficinaAI</h1>
          <p>{t.subtitle}</p>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginTop:"12px"}}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)} title={l.label} style={{fontSize:"22px",background:"none",border:lang===l.code?"2px solid currentColor":"2px solid transparent",borderRadius:"6px",padding:"2px 6px",cursor:"pointer",opacity:lang===l.code?1:0.5}}>
                {l.flag}
              </button>
            ))}
          </div>
        </header>
        <div className="progress-wrap">
          <div className="progress"><div className="progress-fill" style={{width:`${progress}%`}} /></div>
          <p className="progress-text">{t.step} {step} {t.of} 8</p>
        </div>
        {catalogoError && <div className="error">{catalogoError}</div>}
        {error && <div className="error">{error}</div>}
        <div className="card">{renderStep()}</div>
        <div className="footer-actions">
          {step > 1 && step < 8 && <button className="secondary" onClick={() => setStep(step-1)}>{t.back}</button>}
          {step < 7 && <button className="primary" onClick={() => setStep(step+1)}>{t.next}</button>}
          {step === 7 && <button className="primary" onClick={generateConfiguration} disabled={loading}>{loading ? t.generating : t.generate}</button>}
          {step === 8 && result && <>
            <button className="secondary" onClick={() => setStep(7)}>{t.editData}</button>
            <button className="secondary" onClick={copyText}>{t.copyText}</button>
            <button className="secondary wa" onClick={openWhatsApp}>{t.openWhatsApp}</button>
            <button className="primary" onClick={resetAll}>{t.newConfig}</button>
          </>}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) { return <section><h2 className="section-title">{title}</h2>{children}</section>; }
function Field({ label, children }) { return <label className="field"><span className="label">{label}</span>{children}</label>; }
function CheckboxGroup({ options, values, onToggle }) { return <div className="checkbox-group">{options.map(opt=><label key={opt.value} className="checkbox-item"><input type="checkbox" checked={values.includes(opt.value)} onChange={()=>onToggle(opt.value)} /><span>{opt.label}</span></label>)}</div>; }
function ToggleRow({ label, checked, onChange }) { return <label className="toggle-row"><span>{label}</span><input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} /></label>; }

function MachineBlock({ title, item, t }) {
  return (
    <div className="machine-block">
      <h5>{title}</h5>
      <p><strong>{t.codice}:</strong> {item?.code || t.da_definire}</p>
      <p><strong>{t.modello}:</strong> {item?.model || item?.name || "-"}</p>
      {item?.csv_description && <p><strong>{t.descr_csv}:</strong> {item.csv_description}</p>}
      <p><strong>{t.dettagli}:</strong> {(item?.details || []).join(", ") || "-"}</p>
      <p><strong>{t.differenze}:</strong> {item?.difference || "-"}</p>
      <p><strong>{t.motivo}:</strong> {item?.motivo || "-"}</p>
    </div>
  );
}

function LiftBlock({ item, t }) {
  return (
    <div className="machine-block">
      <p><strong>{t.codice}:</strong> {item?.code || t.da_definire}</p>
      <p><strong>{t.modello}:</strong> {item?.model || "-"}</p>
      {item?.csv_description && <p><strong>{t.descr_csv}:</strong> {item.csv_description}</p>}
      {item?.portata && <p><strong>{t.portata}:</strong> {item.portata}</p>}
      {item?.altezza_min && <p><strong>{t.altezza_min}:</strong> {item.altezza_min}</p>}
      {item?.alimentazione && <p><strong>{t.alimentazione}:</strong> {item.alimentazione}</p>}
      <p><strong>{t.dettagli}:</strong> {(item?.details || []).join(", ") || "-"}</p>
      <p><strong>{t.motivo}:</strong> {item?.motivo || "-"}</p>
    </div>
  );
}

function OfferCard({ title, data, truck=false, t }) {
  if (!data) return null;
  return (
    <div className="offer-card">
      <h4>{title}</h4>
      <MachineBlock title={t.smontagomme} item={data?.smontagomme} t={t} />
      <MachineBlock title={t.equilibratrice} item={data?.equilibratrice} t={t} />
      {truck && <MachineBlock title={t.gabbia_gonfiaggio} item={data?.gabbia_gonfiaggio} t={t} />}
      {(data?.accessori||[]).length > 0 && <div className="machine-block"><h5>{t.accessori}</h5>{data.accessori.map((a,idx)=><div key={idx} className="accessory-item"><p><strong>{t.codice}:</strong> {a.code||"-"}</p><p><strong>{t.nome}:</strong> {a.name||"-"}</p><p><strong>{t.dettagli}:</strong> {(a.details||[]).join(", ")||"-"}</p><p><strong>{t.motivo}:</strong> {a.motivo||"-"}</p></div>)}</div>}
    </div>
  );
}

function ResultView({ result, t }) {
  const auto = result?.linea_auto || {};
  const truck = result?.linea_truck || {};
  const sollevatori = result?.sollevatori || [];
  return (
    <div className="result-wrap">
      <div className="result-block hero-result">
        <h3>{t.profilo}</h3>
        <p>{result?.profilo_officina?.sintesi || "-"}</p>
        <p><strong>{t.classe_volume}:</strong> {result?.profilo_officina?.classe_volume || "-"}</p>
      </div>
      {auto?.attiva && <div className="result-block"><h3>{t.linea_auto}</h3><div className="offer-grid"><OfferCard title={t.base} data={auto.base} t={t} /><OfferCard title={t.consigliata} data={auto.consigliata} t={t} /><OfferCard title={t.premium} data={auto.premium} t={t} /></div></div>}
      {truck?.attiva && <div className="result-block"><h3>{t.linea_truck}</h3><div className="offer-grid"><OfferCard title={t.base} data={truck.base} truck t={t} /><OfferCard title={t.consigliata} data={truck.consigliata} truck t={t} /><OfferCard title={t.premium} data={truck.premium} truck t={t} /></div></div>}
      {sollevatori.length > 0 && (
        <div className="result-block">
          <h3>{t.sollevatori}</h3>
          <div className="offer-grid">
            {sollevatori.map((s, idx) => <LiftBlock key={idx} item={s} t={t} />)}
          </div>
        </div>
      )}
      <div className="result-block"><h3>{t.note_op}</h3><ul>{(result?.note_operative||[]).map((n,idx)=><li key={idx}>{n}</li>)}</ul></div>
      <div className="result-block"><h3>{t.domande}</h3><ul>{(result?.domande_successive||[]).map((n,idx)=><li key={idx}>{n}</li>)}</ul></div>
    </div>
  );
}
