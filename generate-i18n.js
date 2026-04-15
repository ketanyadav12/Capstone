const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'assets', 'i18n');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const translations = {
    en: {
        HEADER: { TITLE: "Smart Village Dashboard", ADD_DATA: "Add Data", LANGUAGE: "Language" },
        SIDEBAR: { DASHBOARD: "Dashboard", MAP: "Map", LOGOUT: "Logout" },
        DASH: { COMPARISON: "Village Comparison", TRENDS: "Growth Trends", RESOURCES: "Resource Distribution", INSIGHTS: "AI Insights" }
    },
    hi: {
        HEADER: { TITLE: "स्मार्ट विलेज डैशबोर्ड", ADD_DATA: "डेटा जोड़ें", LANGUAGE: "भाषा" },
        SIDEBAR: { DASHBOARD: "डैशबोर्ड", MAP: "मानचित्र", LOGOUT: "लॉग आउट" },
        DASH: { COMPARISON: "गाँव की तुलना", TRENDS: "विकास के रुझान", RESOURCES: "संसाधन वितरण", INSIGHTS: "एआई अंतर्दृष्टि" }
    },
    bn: {
        HEADER: { TITLE: "স্মার্ট ভিলেজ ড্যাশবোর্ড", ADD_DATA: "ডেটা যোগ করুন", LANGUAGE: "ভাষা" },
        SIDEBAR: { DASHBOARD: "ড্যাশবোর্ড", MAP: "মানচিত্র", LOGOUT: "লগ আউট" },
        DASH: { COMPARISON: "গ্রামের তুলনা", TRENDS: "বৃদ্ধির প্রবণতা", RESOURCES: "সম্পদ বিতরণ", INSIGHTS: "এআই অন্তর্দৃষ্টি" }
    },
    pa: {
        HEADER: { TITLE: "ਸਮਾਰਟ ਵਿਲੇਜ ਡੈਸ਼ਬੋਰਡ", ADD_DATA: "ਡੇਟਾ ਸ਼ਾਮਲ ਕਰੋ", LANGUAGE: "ਭਾਸ਼ਾ" },
        SIDEBAR: { DASHBOARD: "ਡੈਸ਼ਬੋਰਡ", MAP: "ਨਕਸ਼ਾ", LOGOUT: "ਲਾਗ ਆਉਟ" },
        DASH: { COMPARISON: "ਪਿੰਡ ਦੀ ਤੁਲਨਾ", TRENDS: "ਵਿਕਾਸ ਦੇ ਰੁਝਾਨ", RESOURCES: "ਸਰੋਤ ਵੰਡ", INSIGHTS: "ਏਆਈ ਇਨਸਾਈਟਸ" }
    },
    mr: {
        HEADER: { TITLE: "स्मार्ट व्हिलेज डॅशबोर्ड", ADD_DATA: "डेटा जोडा", LANGUAGE: "भाषा" },
        SIDEBAR: { DASHBOARD: "डॅशबोर्ड", MAP: "नकाशा", LOGOUT: "लॉगआउट" },
        DASH: { COMPARISON: "गावाची तुलना", TRENDS: "विकासाचे कल", RESOURCES: "संसाधन वितरण", INSIGHTS: "एआय अंतर्दृष्टी" }
    },
    te: {
        HEADER: { TITLE: "స్మార్ట్ విలేజ్ డాష్‌బోర్డ్", ADD_DATA: "డేటాను జోడించండి", LANGUAGE: "భాష" },
        SIDEBAR: { DASHBOARD: "డాష్‌బోర్డ్", MAP: "మ్యాప్", LOGOUT: "లాగ్ అవుట్" },
        DASH: { COMPARISON: "గ్రామ పోలిక", TRENDS: "వృద్ధి పోకడలు", RESOURCES: "వనరుల పంపిణీ", INSIGHTS: "AI అంతర్దృష్టులు" }
    },
    ml: {
        HEADER: { TITLE: "സ്മാർട്ട് വില്ലേജ് ഡാഷ്‌ബോർഡ്", ADD_DATA: "ഡാറ്റ ചേർക്കുക", LANGUAGE: "ഭാഷ" },
        SIDEBAR: { DASHBOARD: "ഡാഷ്‌ബോർഡ്", MAP: "മാപ്പ്", LOGOUT: "ലോഗ്ഔട്ട്" },
        DASH: { COMPARISON: "ഗ്രാമ താരതമ്യം", TRENDS: "വളർച്ചാ പ്രവണതകൾ", RESOURCES: "വിഭവ വിതരണം", INSIGHTS: "AI ഉൾക്കാഴ്ചകൾ" }
    },
    kn: {
        HEADER: { TITLE: "ಸ್ಮಾರ್ಟ್ ಗ್ರಾಮ ಡ್ಯಾಶ್ಬೋರ್ಡ್", ADD_DATA: "ಡೇಟಾ ಸೇರಿಸಿ", LANGUAGE: "ಭಾಷೆ" },
        SIDEBAR: { DASHBOARD: "ಡ್ಯಾಶ್ಬೋರ್ಡ್", MAP: "ನಕ್ಷೆ", LOGOUT: "ಲಾಗ್ ಔಟ್" },
        DASH: { COMPARISON: "ಗ್ರಾಮ ಹೋಲಿಕೆ", TRENDS: "ಬೆಳವಣಿಗೆ ಪ್ರವೃತ್ತಿಗಳು", RESOURCES: "ಸಂಪನ್ಮೂಲ ವಿತರಣೆ", INSIGHTS: "AI ಒಳನೋಟಗಳು" }
    },
    or: {
        HEADER: { TITLE: "ସ୍ମାର୍ଟ ଭିଲେଜ୍ ଡ୍ୟାସବୋର୍ଡ", ADD_DATA: "ତଥ୍ୟ ଯୋଡନ୍ତୁ", LANGUAGE: "ଭାଷା" },
        SIDEBAR: { DASHBOARD: "ଡ୍ୟାସବୋର୍ଡ", MAP: "ମାନଚିତ୍ର", LOGOUT: "ଲଗଆଉଟ୍" },
        DASH: { COMPARISON: "ଗ୍ରାମ ତୁଳନା", TRENDS: "ଅଭିବୃଦ୍ଧି ଧାରା", RESOURCES: "ବିତରଣ", INSIGHTS: "ଏଆଇ ଅନ୍ତର୍ଦୃଷ୍ଟି" }
    }
};

Object.entries(translations).forEach(([lang, data]) => {
    const filePath = path.join(targetDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Created ${filePath}`);
});
