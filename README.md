# 📱 AI OMR মার্কিং সিস্টেম — Deploy গাইড

## ফাইল স্ট্রাকচার
```
omr-pwa/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── manifest.json
│   ├── icon-192.png     ← আপনি বানাবেন (নিচে দেখুন)
│   └── icon-512.png     ← আপনি বানাবেন (নিচে দেখুন)
└── src/
    ├── main.jsx
    └── App.jsx
```

---

## 🖼️ আইকন তৈরি (icon-192.png ও icon-512.png)

1. [favicon.io](https://favicon.io/favicon-generator/) অথবা [realfavicongenerator.net](https://realfavicongenerator.net) এ যান
2. Emoji: 📝 বা টেক্সট: OMR লিখুন
3. Background: #1b3a5c (নেভি নীল)
4. 192×192 আর 512×512 সাইজে download করুন
5. `public/` ফোল্ডারে রাখুন

---

## 🚀 Vercel-এ Deploy (সবচেয়ে সহজ — বিনামূল্যে)

### ধাপ ১ — GitHub-এ কোড আপলোড
1. [github.com](https://github.com) এ অ্যাকাউন্ট খুলুন (বিনামূল্যে)
2. New Repository তৈরি করুন: `omr-marking`
3. সব ফাইল আপলোড করুন (drag & drop করলেই হবে)

### ধাপ ২ — Vercel-এ Deploy
1. [vercel.com](https://vercel.com) এ যান → GitHub দিয়ে Sign in
2. **"Add New Project"** → আপনার `omr-marking` repo বেছে নিন
3. Settings:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy** চাপুন → ২-৩ মিনিটে লিংক পাবেন!

> উদাহরণ লিংক: `https://omr-marking.vercel.app`

---

## 📲 Android-এ ইন্সটল করুন (PWA)

### Chrome ব্রাউজার দিয়ে:
1. ফোনের Chrome-এ Vercel লিংক খুলুন
2. ডান কোণে **⋮ মেনু** চাপুন
3. **"Add to Home Screen"** বা **"Install App"** চাপুন
4. **Install** confirm করুন

✅ এখন আপনার ফোনের হোম স্ক্রিনে অ্যাপ আইকন দেখা যাবে!

---

## 💻 লোকালি টেস্ট করতে চাইলে

```bash
# Node.js ইন্সটল থাকতে হবে (nodejs.org থেকে)

cd omr-pwa
npm install
npm run dev

# Browser-এ যান: http://localhost:5173
```

---

## 🔧 সমস্যা হলে

| সমস্যা | সমাধান |
|--------|---------|
| Camera কাজ করছে না | HTTPS দরকার — localhost বা Vercel URL ব্যবহার করুন |
| AI কাজ করছে না | Internet connection চেক করুন |
| আইকন দেখা যাচ্ছে না | icon-192.png ও icon-512.png ফাইল public/ ফোল্ডারে আছে কিনা দেখুন |
| Build error | `npm install` আবার রান করুন |

---

## 📞 যোগাযোগ
মহানগর ক্যাডেট একাডেমি — AI OMR সিস্টেম v1.0
