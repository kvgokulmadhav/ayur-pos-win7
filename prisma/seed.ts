import { prisma } from "../lib/prisma";
import { hashPin } from "../lib/auth";
import { syncMasterCatalog } from "../scripts/seed_kottakkal_catalog";

async function main() {
  if (await prisma.product.count() > 0 || await prisma.invoice.count() > 0) {
    console.log("Database already initialized. Syncing official master catalog loose prices...");
    await syncMasterCatalog(prisma);
    return;
  }
  console.log("Seeding demo data. Do not use this command for a live shop.");

  // 1. Store Profiles
  await prisma.storeProfile.upsert({
    where: { id: "kottakkal" },
    update: {},
    create: {
      id: "kottakkal",
      entityType: "KOTTAKKAL",
      storeName: "Kottakkal Arya Vaidya Sala Authorized Agency",
      dealerCode: "KAVS-AG-9204",
      dlNumber: "DL-20B/K-4819 • DL-21B/K-4820",
      fssaiNumber: "FSSAI-11322004001928",
      phone: "+91 94471 28930",
      address: "Shop No. 4, Temple Road, Opp. KSRTC Bus Station",
      invoicePrefix: "KAVS-",
      receiptFooter: "Authorized Kottakkal Arya Vaidya Sala Dealership • Genuine Ayurvedic Formulations"
    }
  });

  await prisma.storeProfile.upsert({
    where: { id: "secondary" },
    update: {},
    create: {
      id: "secondary",
      entityType: "SECONDARY",
      storeName: "Nagarjuna Agency & Allied Wellness Store",
      dealerCode: "NAG-RET-1052",
      dlNumber: "DL-20B/N-9912 • DL-21B/N-9913",
      fssaiNumber: "FSSAI-11322005002011",
      phone: "+91 94471 28930",
      address: "Shop No. 4, Temple Road, Opp. KSRTC Bus Station",
      invoicePrefix: "AGN-",
      receiptFooter: "Ayurvedic Health Care & Allied Products • Thank You"
    }
  });

  // 2. Backup Settings
  await prisma.backupSetting.upsert({
    where: { id: "backup-setting" },
    update: {},
    create: {
      id: "backup-setting",
      localPath: "D:\\AyurPOS_Backups",
      penDrivePath: "E:\\AyurPOS_Backups",
      autoBackupOnClose: true
    }
  });

  // 2b. 3-Level Users (Admin, Manager, Staff with Fast 4-Digit Counter PINs)
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      name: "Admin",
      role: "ADMIN",
      pin: hashPin("1234"),
      phone: "+91 94471 28930"
    }
  });

  await prisma.user.upsert({
    where: { username: "manager" },
    update: {},
    create: {
      username: "manager",
      name: "Senior Pharmacist",
      role: "MANAGER",
      pin: hashPin("2345"),
      phone: "+91 94471 88201"
    }
  });

  await prisma.user.upsert({
    where: { username: "staff" },
    update: {},
    create: {
      username: "staff",
      name: "Counter Cashier",
      role: "STAFF",
      pin: hashPin("3456"),
      phone: "+91 94472 11940"
    }
  });

  // 2c. Sample Customers & Khata Ledger
  const sampleCust1 = await prisma.customer.upsert({
    where: { phone: "94470 55123" },
    update: {},
    create: {
      name: "K. Madhavan Pillai",
      phone: "94470 55123",
      address: "Near Sree Krishna Temple, North Fort",
      totalCredit: 650.0,
      amountPaid: 400.0,
      balanceDue: 250.0,
      notes: "Regular customer credit account - settled monthly"
    }
  });

  await prisma.customerTransaction.createMany({
    data: [
      {
        customerId: sampleCust1.id,
        type: "INVOICE_CREDIT",
        amount: 450.0,
        reference: "KAVS-01001",
        notes: "Dasamoolarishtam & Ksheerabala purchase"
      },
      {
        customerId: sampleCust1.id,
        type: "PAYMENT_RECEIVED",
        amount: 200.0,
        paymentMode: "CASH",
        reference: "REC-2026-001",
        notes: "Partial cash payment received at counter"
      },
      {
        customerId: sampleCust1.id,
        type: "INVOICE_CREDIT",
        amount: 200.0,
        reference: "AGN-00201",
        notes: "Nagarjuna Eladi purchase"
      },
      {
        customerId: sampleCust1.id,
        type: "PAYMENT_RECEIVED",
        amount: 200.0,
        paymentMode: "UPI",
        reference: "UPI-TXN-98412",
        notes: "GPay payment received"
      }
    ]
  });

  await prisma.customer.upsert({
    where: { phone: "98470 12345" },
    update: {},
    create: {
      name: "Sreedharan Nair",
      phone: "98470 12345",
      address: "TC 14/204, Hospital Road",
      totalCredit: 385.0,
      amountPaid: 385.0,
      balanceDue: 0,
      notes: "Prompt payer"
    }
  });

  // 3. Products & Initial Batches
  const products = [

    // --- KOTTAKKAL ARYA VAIDYA SALA (Classicals & Patents) ---
    {
      name: "Dasamoolarishtam 450ml",
      sanskritName: "ദശമൂലാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 195.0,
      purchaseRate: 156.0,
      stock: 45,
      reorderLevel: 15,
      reorderQty: 36,
      rackLocation: "Rack A-1",
      indications: "Fatigue, post-delivery care, debility, vata disorders"
    },
    {
      name: "Balarishtam 450ml",
      sanskritName: "ബലാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 185.0,
      purchaseRate: 148.0,
      stock: 32,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack A-1",
      indications: "Nerve weakness, arthritis, muscle wasting"
    },
    {
      name: "Abhayarishtam 450ml",
      sanskritName: "അഭയാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 175.0,
      purchaseRate: 140.0,
      stock: 28,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack A-2",
      indications: "Piles, constipation, digestive debility"
    },
    {
      name: "Ashokarishtam 450ml",
      sanskritName: "അശോകാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 190.0,
      purchaseRate: 152.0,
      stock: 38,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack A-2",
      indications: "Female uterine tonic, menorrhagia, dysmenorrhea"
    },
    {
      name: "Draksharishtam 450ml",
      sanskritName: "ദ്രാക്ഷാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 210.0,
      purchaseRate: 168.0,
      stock: 40,
      reorderLevel: 15,
      reorderQty: 30,
      rackLocation: "Rack A-3",
      indications: "General fatigue, respiratory weakness, appetizing"
    },
    {
      name: "Jeerakarishtam 450ml",
      sanskritName: "ജീരകാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 180.0,
      purchaseRate: 144.0,
      stock: 22,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack A-3",
      indications: "Digestive disorders, puerperal care"
    },
    {
      name: "Amritarishtam 450ml",
      sanskritName: "അമൃതരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 175.0,
      purchaseRate: 140.0,
      stock: 18,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack A-4",
      indications: "Chronic fever, immune tonic, digestive debility"
    },
    {
      name: "Saraswatarishtam with Gold 450ml",
      sanskritName: "സാരസ്വതാരിഷ്ടം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 320.0,
      purchaseRate: 256.0,
      stock: 14,
      reorderLevel: 8,
      reorderQty: 18,
      rackLocation: "Rack A-4",
      indications: "Memory booster, intellect, speech clarity"
    },
    {
      name: "Lohasavam 450ml",
      sanskritName: "ലോഹാസവം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Asavam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 180.0,
      purchaseRate: 144.0,
      stock: 25,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack B-1",
      indications: "Iron deficiency anemia, liver enlargement, swelling"
    },
    {
      name: "Chandanasavam 450ml",
      sanskritName: "ചന്ദനാസവം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Asavam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 225.0,
      purchaseRate: 180.0,
      stock: 16,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack B-1",
      indications: "Burning urination, spermatorrhoea, body heat"
    },
    {
      name: "Arvindasavam 450ml",
      sanskritName: "അരവിന്ദാസവം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Asavam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 195.0,
      purchaseRate: 156.0,
      stock: 19,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack B-2",
      indications: "Pediatric health tonic, digestion in children"
    },
    {
      name: "Maharasnadi Kashayam 200ml",
      sanskritName: "മഹാരാസ്നാദി കഷായം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 150.0,
      purchaseRate: 120.0,
      stock: 35,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack B-3",
      indications: "Paralysis, joint inflammation, severe vata pain"
    },
    {
      name: "Sahacharadi Kashayam 200ml",
      sanskritName: "സഹചരാദി കഷായം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 140.0,
      purchaseRate: 112.0,
      stock: 30,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack B-3",
      indications: "Sciatica, lower back pain, varicose veins"
    },
    {
      name: "Dhanwantharam Kashayam 200ml",
      sanskritName: "ധന്വന്തരം കഷായം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 145.0,
      purchaseRate: 116.0,
      stock: 26,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack B-4",
      indications: "Rheumatoid conditions, postnatal recuperation"
    },
    {
      name: "Rasnasaptakam Kashayam 200ml",
      sanskritName: "രാസ്നാസപ്തകം കഷായം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 135.0,
      purchaseRate: 108.0,
      stock: 8, // Low stock to demonstrate one-click indent!
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack B-4",
      indications: "Lumbago, hip joint pain, thigh stiffness"
    },
    {
      name: "Varanadi Kashayam 200ml",
      sanskritName: "വരണാദി കഷായം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 155.0,
      purchaseRate: 124.0,
      stock: 24,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack B-5",
      indications: "Obesity, internal abscess, cholesterol, headaches"
    },
    {
      name: "Sahacharadi Kuzhambu 200ml",
      sanskritName: "സഹചരാദി കുഴമ്പ്",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 190.0,
      purchaseRate: 152.0,
      stock: 42,
      reorderLevel: 15,
      reorderQty: 36,
      rackLocation: "Rack C-1",
      indications: "Sciatica, lumbar spondylosis massage oil"
    },
    {
      name: "Ksheerabala Thailam 200ml",
      sanskritName: "ക്ഷീരബല തൈലം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 180.0,
      purchaseRate: 144.0,
      stock: 35,
      reorderLevel: 12,
      reorderQty: 30,
      rackLocation: "Rack C-1",
      indications: "Nerve nourishment, insomnia, head massage"
    },
    {
      name: "Dhanwantharam Thailam 200ml",
      sanskritName: "ധന്വന്തരം തൈലം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 185.0,
      purchaseRate: 148.0,
      stock: 30,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack C-2",
      indications: "General body massage, post-partum massage"
    },
    {
      name: "Pinda Thailam 200ml",
      sanskritName: "പിണ്ഡ തൈലം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 165.0,
      purchaseRate: 132.0,
      stock: 5, // Low stock to trigger indent
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack C-2",
      indications: "Gout, burning sensations, painful joints"
    },
    {
      name: "Murivenna 200ml",
      sanskritName: "മുറിവെണ്ണ",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 170.0,
      purchaseRate: 136.0,
      stock: 50,
      reorderLevel: 15,
      reorderQty: 40,
      rackLocation: "Rack C-3",
      indications: "Fractures, sprains, blunt injury, quick wound healing"
    },
    {
      name: "Karpooradi Thailam 100ml",
      sanskritName: "കർപ്പൂരാദി തൈലം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "100 ml",
      unitPrice: 120.0,
      purchaseRate: 96.0,
      stock: 32,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack C-3",
      indications: "Chest congestion, cramps, stiffness, back pain"
    },
    {
      name: "Nilibringadi Keratailam 200ml",
      sanskritName: "നീലഭൃംഗാദി കേരതൈലം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 230.0,
      purchaseRate: 184.0,
      stock: 45,
      reorderLevel: 15,
      reorderQty: 36,
      rackLocation: "Rack C-4",
      indications: "Hair growth, premature greying, cooling head oil"
    },
    {
      name: "Chyavanaprasam 500g",
      sanskritName: "ച്യവനപ്രാശം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Lehyam",
      unitType: "JAR",
      packSize: "500 g",
      unitPrice: 260.0,
      purchaseRate: 208.0,
      stock: 48,
      reorderLevel: 15,
      reorderQty: 36,
      rackLocation: "Rack D-1",
      indications: "Premier Rasayana, immunity booster, lung strength"
    },
    {
      name: "Agasthya Rasayanam 500g",
      sanskritName: "അഗസ്ത്യ രസായനം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Lehyam",
      unitType: "JAR",
      packSize: "500 g",
      unitPrice: 250.0,
      purchaseRate: 200.0,
      stock: 22,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack D-1",
      indications: "Asthma, bronchitis, persistent cough"
    },
    {
      name: "Brahma Rasayanam 500g",
      sanskritName: "ബ്രഹ്മ രസായനം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Lehyam",
      unitType: "JAR",
      packSize: "500 g",
      unitPrice: 275.0,
      purchaseRate: 220.0,
      stock: 18,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack D-2",
      indications: "Rejuvenation, anti-aging, mental endurance"
    },
    {
      name: "Brahmi Ghritham 150g",
      sanskritName: "ബ്രാഹ്മീ ഘൃതം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Ghritham",
      unitType: "JAR",
      packSize: "150 g",
      unitPrice: 210.0,
      purchaseRate: 168.0,
      stock: 16,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack D-3",
      indications: "Memory enhancer, anxiety, cognitive clarity"
    },
    {
      name: "Guggulutiktaka Ghritham 150g",
      sanskritName: "ഗുഗ്ഗുലുതിക്തകം ഘൃതം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Ghritham",
      unitType: "JAR",
      packSize: "150 g",
      unitPrice: 240.0,
      purchaseRate: 192.0,
      stock: 14,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack D-3",
      indications: "Skin disorders, fistula, arthritis, deep tissue healing"
    },
    {
      name: "Yogaraja Guggulu 100 Tab",
      sanskritName: "യോഗരാജ ഗുഗ്ഗുലു",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Gulika/Vati",
      unitType: "BOTTLE",
      packSize: "100 Tab",
      unitPrice: 210.0,
      purchaseRate: 168.0,
      stock: 28,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack E-1",
      indications: "Chronic joint stiffness, arthritis, neuromuscular pain"
    },
    {
      name: "Kaisora Guggulu 100 Tab",
      sanskritName: "കൈശോര ഗുഗ്ഗുലു",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Gulika/Vati",
      unitType: "BOTTLE",
      packSize: "100 Tab",
      unitPrice: 220.0,
      purchaseRate: 176.0,
      stock: 25,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack E-1",
      indications: "Gout (Vatarakta), blood purification, skin boils"
    },
    {
      name: "Kanchanara Guggulu 100 Tab",
      sanskritName: "കാഞ്ചനാര ഗുഗ്ഗുലു",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Gulika/Vati",
      unitType: "BOTTLE",
      packSize: "100 Tab",
      unitPrice: 215.0,
      purchaseRate: 172.0,
      stock: 20,
      reorderLevel: 8,
      reorderQty: 20,
      rackLocation: "Rack E-2",
      indications: "Thyroid nodules, lymphadenitis, ovarian cysts"
    },
    {
      name: "Chandraprabha Vati 100 Tab",
      sanskritName: "ചന്ദ്രപ്രഭാ വടി",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Gulika/Vati",
      unitType: "BOTTLE",
      packSize: "100 Tab",
      unitPrice: 195.0,
      purchaseRate: 156.0,
      stock: 26,
      reorderLevel: 10,
      reorderQty: 20,
      rackLocation: "Rack E-2",
      indications: "Urinary tract infections, diabetes, prostate health"
    },
    {
      name: "Dhanwantharam Gulika 100 Tab",
      sanskritName: "ധന്വന്തരം ഗുളിക",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Gulika/Vati",
      unitType: "BOTTLE",
      packSize: "100 Tab",
      unitPrice: 170.0,
      purchaseRate: 136.0,
      stock: 35,
      reorderLevel: 12,
      reorderQty: 24,
      rackLocation: "Rack E-3",
      indications: "Gas trouble, breathlessness, abdominal bloating"
    },
    {
      name: "Avipathi Choornam 100g",
      sanskritName: "അവിപത്തി ചൂർണ്ണം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Choornam",
      unitType: "PACKET",
      packSize: "100 g",
      unitPrice: 95.0,
      purchaseRate: 76.0,
      stock: 40,
      reorderLevel: 15,
      reorderQty: 30,
      rackLocation: "Rack F-1",
      indications: "Hyperacidity, mild laxative, pitta regulator"
    },
    {
      name: "Triphala Choornam 100g",
      sanskritName: "ത്രിഫലാ ചൂർണ്ണം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Choornam",
      unitType: "PACKET",
      packSize: "100 g",
      unitPrice: 85.0,
      purchaseRate: 68.0,
      stock: 45,
      reorderLevel: 15,
      reorderQty: 40,
      rackLocation: "Rack F-1",
      indications: "Bowel regulation, eye wash, digestive detox"
    },
    {
      name: "Eladi Choornam 50g (Kottakkal)",
      sanskritName: "ഏലാദി ചൂർണ്ണം",
      brand: "Kottakkal Arya Vaidya Sala",
      isKottakkal: true,
      category: "Choornam",
      unitType: "PACKET",
      packSize: "50 g",
      unitPrice: 80.0,
      purchaseRate: 64.0,
      stock: 30,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack F-2",
      indications: "Skin complexions, itching, face pack"
    },

    // --- SECONDARY AGENCY PRODUCTS (Nagarjuna, Vaidyaratnam, OTC, Allied) ---
    {
      name: "Nagarjuna Eladi Choornam 50g",
      sanskritName: "ഏലാദി ചൂർണ്ണം (നാഗാർജ്ജുന)",
      brand: "Nagarjuna",
      isKottakkal: false,
      category: "Choornam",
      unitType: "PACKET",
      packSize: "50 g",
      unitPrice: 75.0,
      purchaseRate: 60.0,
      stock: 25,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack G-1",
      indications: "Acne, skin allergy, facial scrub"
    },
    {
      name: "Nagarjuna Murivenna 200ml",
      sanskritName: "മുറിവെണ്ണ (നാഗാർജ്ജുന)",
      brand: "Nagarjuna",
      isKottakkal: false,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 165.0,
      purchaseRate: 132.0,
      stock: 20,
      reorderLevel: 8,
      reorderQty: 20,
      rackLocation: "Rack G-1",
      indications: "Sprains, external wounds, pain relief"
    },
    {
      name: "Nagarjuna Ksheerabala 101 Drops 10ml",
      sanskritName: "ക്ഷീരബല 101 ആവർത്തി",
      brand: "Nagarjuna",
      isKottakkal: false,
      category: "Tailam",
      unitType: "BOTTLE",
      packSize: "10 ml",
      unitPrice: 190.0,
      purchaseRate: 152.0,
      stock: 12,
      reorderLevel: 6,
      reorderQty: 15,
      rackLocation: "Rack G-2",
      indications: "Facial palsy, insomnia, nervous disorders"
    },
    {
      name: "Vaidyaratnam Dasamoolarishtam 450ml",
      sanskritName: "ദശമൂലാരിഷ്ടം (വൈദ്യരത്നം)",
      brand: "Vaidyaratnam",
      isKottakkal: false,
      category: "Arishtam",
      unitType: "BOTTLE",
      packSize: "450 ml",
      unitPrice: 190.0,
      purchaseRate: 152.0,
      stock: 18,
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack G-3",
      indications: "General body fatigue, debility"
    },
    {
      name: "Vaidyaratnam Ashtavargam Kashayam 200ml",
      sanskritName: "അഷ്ടവർഗ്ഗം കഷായം",
      brand: "Vaidyaratnam",
      isKottakkal: false,
      category: "Kashayam",
      unitType: "BOTTLE",
      packSize: "200 ml",
      unitPrice: 145.0,
      purchaseRate: 116.0,
      stock: 4, // Low stock to trigger secondary indent
      reorderLevel: 8,
      reorderQty: 16,
      rackLocation: "Rack G-3",
      indications: "Vata roga, joint stiffness"
    },
    {
      name: "AVP Gandha Thailam 10 Softgels",
      sanskritName: "ഗന്ധ തൈലം കാപ്സ്യൂൾ",
      brand: "AVP Coimbatore",
      isKottakkal: false,
      category: "Patent/OTC",
      unitType: "STRIP",
      packSize: "10 Capsules",
      unitPrice: 130.0,
      purchaseRate: 104.0,
      stock: 22,
      reorderLevel: 8,
      reorderQty: 20,
      rackLocation: "Rack H-1",
      indications: "Bone fracture healing, ligament tears, osteoporosis"
    },
    {
      name: "Himalaya Liv.52 DS Tablets 60s",
      sanskritName: "ലിവ്.52 ഡിഎസ്",
      brand: "Himalaya",
      isKottakkal: false,
      category: "Patent/OTC",
      unitType: "BOTTLE",
      packSize: "60 Tab",
      unitPrice: 175.0,
      purchaseRate: 140.0,
      stock: 35,
      reorderLevel: 10,
      reorderQty: 30,
      rackLocation: "Rack H-2",
      indications: "Hepatoprotective, appetite stimulant"
    },
    {
      name: "Dabur Pure Honey 500g",
      sanskritName: "ഡാബർ ശുദ്ധ തേൻ",
      brand: "Dabur",
      isKottakkal: false,
      category: "Health",
      unitType: "JAR",
      packSize: "500 g",
      unitPrice: 220.0,
      purchaseRate: 185.0,
      stock: 28,
      reorderLevel: 10,
      reorderQty: 24,
      rackLocation: "Rack H-3",
      indications: "Pure honey for Kashayam & Lehyam anupana"
    },
    {
      name: "Cadbury Boost Health Drink 500g Refill",
      sanskritName: "ബൂസ്റ്റ് ഹെൽത്ത് ഡ്രിങ്ക്",
      brand: "General OTC",
      isKottakkal: false,
      category: "Health",
      unitType: "PACKET",
      packSize: "500 g",
      unitPrice: 275.0,
      purchaseRate: 240.0,
      stock: 15,
      reorderLevel: 6,
      reorderQty: 18,
      rackLocation: "Rack H-4",
      indications: "Malt nutritional beverage for kids"
    },
    {
      name: "Pure Wild Forest Honey 500ml",
      sanskritName: "ശുദ്ധ കാട്ടുതേൻ",
      brand: "Kerala Tribal Agro",
      isKottakkal: false,
      category: "Health",
      unitType: "BOTTLE",
      packSize: "500 ml",
      unitPrice: 350.0,
      purchaseRate: 280.0,
      stock: 16,
      reorderLevel: 6,
      reorderQty: 12,
      rackLocation: "Rack H-4",
      indications: "Raw unheated medicinal honey"
    }
  ];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      const createdProduct = await prisma.product.create({
        data: p
      });

      const isNearExpiry = i === 14; // Rasnasaptakam
      const expiryDate = isNearExpiry
        ? new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + (12 + (i % 12)) * 30 * 24 * 60 * 60 * 1000);

      const batchNumber = p.isKottakkal
        ? `K-26${String.fromCharCode(65 + (i % 12))}${100 + i}`
        : `NG-26${100 + i}`;

      await prisma.batch.create({
        data: {
          productId: createdProduct.id,
          batchNumber,
          expiryDate,
          mrp: p.unitPrice,
          purchaseRate: p.purchaseRate,
          currentStock: p.stock,
          rackLocation: p.rackLocation
        }
      });
    }
  }

  // 3b. Sync Full Official Kottakkal Master Catalog with Verified Loose MRPs
  await syncMasterCatalog(prisma);

  // 4. Sample Previous Completed Sales to have immediate rich analytics
  const existingSession = await prisma.salesSession.findUnique({ where: { sessionNumber: "SALE-2026-0001" } });
  if (!existingSession) {
    const sampleCustomer = "Sreedharan Nair";
    const session = await prisma.salesSession.create({
      data: {
        sessionNumber: "SALE-2026-0001",
        customerName: sampleCustomer,
        customerPhone: "98470 12345",
        prescribingDoctor: "Dr. K. Ramanathan Vaidyan",
        paymentMode: "CASH",
        totalCollected: 385.0,
        hasKottakkal: true,
        hasSecondary: true,
        notes: "Previous counter walk-in sale"
      }
    });


  // Invoice 1: Kottakkal item
  const dasamoolarishtam = await prisma.product.findFirst({ where: { name: { contains: "Dasamoolarishtam 450ml" } } });
  const kottakkalBatch = await prisma.batch.findFirst({ where: { productId: dasamoolarishtam?.id } });
  if (dasamoolarishtam && kottakkalBatch) {
    const invKavs = await prisma.invoice.create({
      data: {
        invoiceNumber: "KAVS-01001",
        sessionId: session.id,
        billingEntity: "KOTTAKKAL",
        entityStoreName: "Kottakkal Arya Vaidya Sala Authorized Agency",
        subtotal: 195.0,
        discount: 0,
        totalAmount: 195.0,
        paymentMode: "CASH"
      }
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invKavs.id,
        productId: dasamoolarishtam.id,
        productName: dasamoolarishtam.name,
        brandName: dasamoolarishtam.brand,
        batchId: kottakkalBatch.id,
        batchNumber: kottakkalBatch.batchNumber,
        quantity: 1,
        unitPrice: 195.0,
        totalPrice: 195.0
      }
    });
  }

  // Invoice 2: Secondary Agency item
  const nagarjunaEladi = await prisma.product.findFirst({ where: { name: { contains: "Nagarjuna Eladi" } } });
  const nagBatch = await prisma.batch.findFirst({ where: { productId: nagarjunaEladi?.id } });
  if (nagarjunaEladi && nagBatch) {
    const invAgn = await prisma.invoice.create({
      data: {
        invoiceNumber: "AGN-00201",
        sessionId: session.id,
        billingEntity: "SECONDARY",
        entityStoreName: "Nagarjuna Agency & Allied Wellness Store",
        subtotal: 75.0,
        discount: 0,
        totalAmount: 75.0,
        paymentMode: "CASH"
      }
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invAgn.id,
        productId: nagarjunaEladi.id,
        productName: nagarjunaEladi.name,
        brandName: nagarjunaEladi.brand,
        batchId: nagBatch.id,
        batchNumber: nagBatch.batchNumber,
        quantity: 1,
        unitPrice: 75.0,
        totalPrice: 75.0
      }
    });
  }
}

  // Customer Ledger
  await prisma.customerLedger.upsert({
    where: { customerPhone: "94470 55123" },
    update: {},
    create: {
      customerName: "K. Madhavan Pillai",
      customerPhone: "94470 55123",
      totalCredit: 450.0,
      amountPaid: 200.0,
      balanceDue: 250.0,
      notes: "Regular customer credit account"
    }
  });

  console.log("AyurPOS Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
