# CareCompass — AI Knowledge Base Content Brief
**Purpose:** Use this document to generate a production-ready WhatsApp bot knowledge base for CareCompass, modelled on the structure extracted from Shifa Home Health Care (a real, comparable Dubai home healthcare provider). The output will be imported directly into the bot system — treat every answer as something the bot will say verbatim to a customer on WhatsApp.

---

## 1. CareCompass — Company Brief

| Field | Value |
|---|---|
| **Company name** | CareCompass |
| **Tagline** | DHA-licensed doctors, nurses, and physiotherapists delivered to your Dubai home within 60 minutes. Available 24/7. |
| **Headline** | World-Class Healthcare at Home |
| **Industry** | Home healthcare / at-home medical services |
| **Location** | Dubai, UAE |
| **Languages** | English (primary), Arabic (secondary) |
| **Website** | carecompass.me |
| **Primary colour** | #4A7C59 (teal-green) |
| **Secondary colour** | #1B4F8A (deep blue) |

### What CareCompass does
CareCompass is a DHA-licensed home healthcare provider in Dubai that dispatches doctors, nurses, physiotherapists, and caregivers directly to the patient's home, hotel, or workplace within 60 minutes. It operates 24/7 and positions itself as a premium, convenient alternative to hospital or clinic visits for non-emergency medical needs.

### Services to cover (generate knowledge for each)
1. **Doctor on Call** — GP/doctor dispatched to home within 60 min
2. **Physiotherapy at Home** — DHA-licensed physios for rehab, pain, sports injuries
3. **Home Nursing** — Post-surgical care, IV therapy, wound dressing, catheter care
4. **Caregivers** — Daily-living support for elderly, disabled, or recovering patients
5. **PCR / Lab Testing at Home** — Blood tests, swabs collected at home
6. **Specialist Teleconsultation** — Online consults with specialists (ENT, dermatology, etc.)

### Key differentiators (weave these into answers)
- **DHA-licensed** — all practitioners hold Dubai Health Authority licences
- **60-minute dispatch** — fastest response promise in Dubai
- **24/7 availability** — no clinic hours, no waiting rooms
- **Multilingual team** — English and Arabic speaking staff
- **Covers home, hotel, and workplace** — not just residential
- **Premium but accessible** — flat-fee pricing agreed before visit, no surprise bills

---

## 2. Knowledge Base Structure

The bot system uses a structured Q&A knowledge base. Each entry has the following fields:

| Field | Description | Values |
|---|---|---|
| `category` | Topic bucket the fact belongs to | See list below |
| `review_key` | Canonical profile field this maps to | See list below |
| `question` | How a customer would actually ask this on WhatsApp | Conversational, 1 sentence |
| `answer` | The bot's verbatim response | 1–3 sentences max, direct, no filler |
| `confidence` | How certain the answer is | 0.95 = explicitly stated fact; 0.9 = clear inference; 0.8 = reasonable assumption |
| `language` | Language of this entry | `en` or `ar` |

### Categories (use exactly these values)

| Category | What belongs here |
|---|---|
| `identity` | Who the company is, what it does, its mission |
| `service` | Individual services, what each includes, conditions treated |
| `process` | How the service works step by step, timelines, what to expect |
| `booking` | How to book, what channels, how fast, confirmation process |
| `contact` | Phone numbers, email, address, hours |
| `pricing` | Costs, flat fees, what affects price, payment methods |
| `trust` | Qualifications, licences, certifications, team credentials |
| `location` | Coverage area, which emirates, home/hotel/office |
| `faq` | Common patient questions not fitting above categories |
| `target_customer` | Who the service is for, ideal patient profiles |
| `limitation` | What the service cannot do, when to go to hospital, scope limits |
| `language` | Language availability of service/staff |

### Review Keys (use exactly these values or `null`)

| Review Key | Maps to |
|---|---|
| `what_it_does` | Core company/service description |
| `main_services` | Service list |
| `booking_path` | How to book |
| `pricing_policy` | Pricing approach |
| `geography` | Coverage area |
| `trust_signals` | Qualifications and credentials |
| `target_customers` | Who they serve |
| `escalation_rules` | When to escalate / limitations |
| `limitations` | Scope limits |
| `null` | Fact doesn't map to a canonical field |

---

## 3. Reference: Shifa Healthcare Sample Entries

These are real extracted entries from a comparable Dubai home healthcare provider. Use them as a format and tone reference — **do not copy content**, generate equivalent entries for CareCompass.

### Identity
```
category: identity | review_key: what_it_does | confidence: 0.9 | language: en
Q: What is Shifa Home Health Care?
A: Shifa Home Health Care is a home health care provider offering services in Dubai and across the UAE, dedicated to improving quality of life for homebound individuals.

category: identity | review_key: what_it_does | confidence: 0.9 | language: en
Q: What is Shifa Home Health Care Service?
A: Shifa Home Health Care Service is a provider of care and support services collecting and using certain personal information from clients to deliver care.
```

### Service
```
category: service | review_key: main_services | confidence: 0.95 | language: en
Q: What services does Shifa Health Care offer?
A: Shifa Health Care offers physiotherapy at home, sports therapy services, home nursing services, doctor on call, caregivers at home, and lab testing services at home.

category: service | review_key: main_services | confidence: 0.95 | language: en
Q: What healthcare services do you offer?
A: We offer physiotherapy at home, sports therapy services, home nursing services, doctor on call, caregivers at home, and lab testing services at home.
```

### Process
```
category: process | review_key: null | confidence: 0.95 | language: en
Q: How quickly can Shifa Home Health Care arrive at my location?
A: They aim to be at your location within 30 to 45 minutes or even sooner, following efficient operational protocols.

category: process | review_key: limitations | confidence: 0.95 | language: en
Q: Is Shifa Home Health Care available 24/7?
A: Yes, Shifa Home Health Care is available every day, 24 hours.
```

### Booking
```
category: booking | review_key: booking_path | confidence: 0.95 | language: en
Q: How can I book a physiotherapy home visit?
A: You can book a physiotherapy home visit by calling or WhatsApping +971585726923.

category: booking | review_key: booking_path | confidence: 0.9 | language: en
Q: How quickly will I be contacted after requesting a call back?
A: You will usually be contacted within 24 hours of your request.
```

### Pricing
```
category: pricing | review_key: pricing_policy | confidence: 0.9 | language: en
Q: Is the doctor on call service more affordable than an emergency room visit?
A: Doctor on call service is more affordable than an emergency room visit and only charges a flat fee agreed upon before the doctor arrives.

category: pricing | review_key: pricing_policy | confidence: 0.9 | language: en
Q: How much do care giver services cost?
A: The cost of care giver services varies depending on the level of care needed, geographic location, and other factors. It's important to discuss payment options beforehand.
```

### Trust
```
category: trust | review_key: trust_signals | confidence: 0.92 | language: en
Q: Are your physiotherapists certified?
A: Yes, their physiotherapists are Dubai Health Authority (DHA) certified and trained.

category: trust | review_key: trust_signals | confidence: 0.9 | language: en
Q: Are Shifa Health Care's care givers qualified?
A: Care givers at Shifa Health Care may have qualifications such as certification as a nursing assistant or home health aide, or experience with specific medical conditions.
```

### Location
```
category: location | review_key: geography | confidence: 0.9 | language: en
Q: Is Shifa Health Care available in Dubai?
A: Yes, Shifa Health Care offers services such as physiotherapy, doctor on call, home nursing, care givers, and lab testing at home in Dubai.

category: location | review_key: geography | confidence: 0.9 | language: en
Q: Where does Shifa Home Health Care provide its services?
A: Shifa Home Health Care serves patients across the United Arab Emirates and is located in Dubai.
```

### FAQ
```
category: faq | review_key: target_customers | confidence: 0.9 | language: en
Q: Who can benefit from care giver services at home?
A: Individuals who are elderly, disabled, recovering from illness or injury, or needing additional support due to chronic medical conditions can benefit from care giver services.

category: faq | review_key: pricing_policy | confidence: 0.9 | language: en
Q: How much does nursing care cost?
A: The cost of nursing care varies depending on the level of care needed, geographic location, and other factors. It is important to discuss costs and payment options with the provider before beginning services.
```

### Limitation
```
category: limitation | review_key: limitations | confidence: 0.9 | language: en
Q: Does physiotherapy treat all back pain, or are there cases where surgery is needed?
A: Physiotherapy is recommended as the initial conservative treatment for most low back pain conditions, before considering more invasive treatments such as back surgery.

category: limitation | review_key: limitations | confidence: 0.9 | language: en
Q: What is the difference between sports therapy and physical therapy?
A: Sports therapy focuses specifically on sports-related injuries and conditions, while physical therapy can treat a wider range of conditions including neurological issues.
```

### Target Customer
```
category: target_customer | review_key: target_customers | confidence: 0.9 | language: en
Q: Who can use home health care services?
A: Patients recovering from illness, managing chronic conditions, or navigating the aging process, as well as families needing medical care at home, office, or hotel, can use these services.
```

---

## 4. Your Task — Generate CareCompass Knowledge Base

Generate a complete knowledge base for CareCompass following the structure above. Requirements:

### Quantity targets (match Shifa's depth)
| Category | English entries | Arabic entries |
|---|---|---|
| `service` | 15–20 | 8–10 |
| `process` | 8–10 | 5–6 |
| `booking` | 8–10 | 5–6 |
| `faq` | 8–10 | 5–6 |
| `trust` | 6–8 | 4–5 |
| `location` | 5–6 | 3–4 |
| `contact` | 5–6 | 3–4 |
| `pricing` | 4–5 | 3–4 |
| `identity` | 3–4 | 2–3 |
| `target_customer` | 3–4 | 2–3 |
| `limitation` | 4–5 | 2–3 |
| `language` | 2 | 2 |

### Rules for English entries
- Answers must be 1–3 sentences, direct, conversational — no "Certainly!" or filler
- Use "CareCompass" as the company name throughout
- Use the 60-minute response and DHA-licensed credentials as recurring trust anchors
- For pricing: do not invent specific AED amounts — say "flat fee agreed before the visit" or "pricing varies by service and duration"
- For contact: use placeholder `[PHONE]` and `[EMAIL]` since real details aren't confirmed
- Confidence 0.95 for core service facts, 0.9 for process/trust facts, 0.8 for inferences

### Rules for Arabic entries
- Write in Modern Standard Arabic (فصحى) but accessible, not formal/legal
- Mirror the English entries — same questions and answers, translated naturally (not word-for-word literal)
- Use `ar` in the language field
- Use "كير كومباس" or "CareCompass" for the company name (transliterated is fine)
- Arabic-specific: add entries about Arabic-speaking staff availability

### Output format
Output as a CSV with these exact columns — one row per entry, ready to import:

```
category,review_key,question,answer,confidence,language
```

Use double-quotes around fields containing commas. Use `null` (unquoted) for empty review_key. Example:

```csv
category,review_key,question,answer,confidence,language
identity,what_it_does,What is CareCompass?,"CareCompass is a DHA-licensed home healthcare provider in Dubai, delivering doctors, nurses, and physiotherapists to your home within 60 minutes, 24 hours a day.",0.95,en
service,main_services,What services does CareCompass offer?,"CareCompass offers doctor on call, physiotherapy at home, home nursing, caregiver support, PCR and lab testing at home, and specialist teleconsultation.",0.95,en
```

### Quality bar — each entry must pass these checks
- ✅ Answer reads naturally as a WhatsApp message (not a website paragraph)
- ✅ No invented specific prices, staff names, or addresses
- ✅ Company name "CareCompass" used consistently (not "they" or "the company")
- ✅ Confidence score reflects how certain the claim is
- ✅ Arabic answers are culturally appropriate, not Google-translated English
- ✅ No duplicate questions within the same category

---

## 5. How to Import the Output

Once the CSV is generated, it will be uploaded as a manual knowledge source for the CareCompass client (id: 23, slug: `carecompass`) in the bot admin panel. Each row becomes an approved knowledge chunk the bot can retrieve during conversations. Arabic entries will be served when the bot detects an Arabic-speaking lead.
