// Hàm đọc tiếng Trung
// 1. Gán thẳng vào window để HTML onclick có thể tìm thấy
function speakNormal(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'zh-CN';
        msg.rate = 0.7; // Tốc độ nói bình thường
        window.speechSynthesis.speak(msg);
    }
}

function speakSlow(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = 'zh-CN';
        msg.rate = 0.35; // Tốc độ nói chậm
        window.speechSynthesis.speak(msg);
    }
}

function setupTermynal() {
    document.querySelectorAll(".use-termynal").forEach(node => {
        node.style.display = "block";
        new Termynal(node, {
            lineDelay: 500
        });
    });
    const progressLiteralStart = "---> 100%";
    const promptLiteralStart = "$ ";
    const customPromptLiteralStart = "# ";
    const termynalActivateClass = "termy";
    let termynals = [];

    function createTermynals() {
        document
            .querySelectorAll(`.${termynalActivateClass} .highlight code`)
            .forEach(node => {
                const text = node.textContent;
                const lines = text.split("\n");
                const useLines = [];
                let buffer = [];
                function saveBuffer() {
                    if (buffer.length) {
                        let isBlankSpace = true;
                        buffer.forEach(line => {
                            if (line) {
                                isBlankSpace = false;
                            }
                        });
                        dataValue = {};
                        if (isBlankSpace) {
                            dataValue["delay"] = 0;
                        }
                        if (buffer[buffer.length - 1] === "") {
                            // A last single <br> won't have effect
                            // so put an additional one
                            buffer.push("");
                        }
                        const bufferValue = buffer.join("<br>");
                        dataValue["value"] = bufferValue;
                        useLines.push(dataValue);
                        buffer = [];
                    }
                }
                for (let line of lines) {
                    if (line === progressLiteralStart) {
                        saveBuffer();
                        useLines.push({
                            type: "progress"
                        });
                    } else if (line.startsWith(promptLiteralStart)) {
                        saveBuffer();
                        const value = line.replace(promptLiteralStart, "").trimEnd();
                        useLines.push({
                            type: "input",
                            value: value
                        });
                    } else if (line.startsWith("// ")) {
                        saveBuffer();
                        const value = "💬 " + line.replace("// ", "").trimEnd();
                        useLines.push({
                            value: value,
                            class: "termynal-comment",
                            delay: 0
                        });
                    } else if (line.startsWith(customPromptLiteralStart)) {
                        saveBuffer();
                        const promptStart = line.indexOf(promptLiteralStart);
                        if (promptStart === -1) {
                            console.error("Custom prompt found but no end delimiter", line)
                        }
                        const prompt = line.slice(0, promptStart).replace(customPromptLiteralStart, "")
                        let value = line.slice(promptStart + promptLiteralStart.length);
                        useLines.push({
                            type: "input",
                            value: value,
                            prompt: prompt
                        });
                    } else {
                        buffer.push(line);
                    }
                }
                saveBuffer();
                const div = document.createElement("div");
                node.replaceWith(div);
                const termynal = new Termynal(div, {
                    lineData: useLines,
                    noInit: true,
                    lineDelay: 500
                });
                termynals.push(termynal);
            });
    }

    function loadVisibleTermynals() {
        termynals = termynals.filter(termynal => {
            if (termynal.container.getBoundingClientRect().top - innerHeight <= 0) {
                termynal.init();
                return false;
            }
            return true;
        });
    }
    window.addEventListener("scroll", loadVisibleTermynals);
    createTermynals();
    loadVisibleTermynals();
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

async function showRandomAnnouncement(groupId, timeInterval) {
    const announceFastAPI = document.getElementById(groupId);
    if (announceFastAPI) {
        let children = [].slice.call(announceFastAPI.children);
        children = shuffle(children)
        if (children.length === 0) return;
        let index = 0
        const announceRandom = () => {
            children.forEach((el, i) => { el.style.display = "none" });
            children[index].style.display = "block"
            index = (index + 1) % children.length
        }
        announceRandom()
        setInterval(announceRandom, timeInterval
        )
    }
}

function handleSponsorImages() {
    const announceRight = document.getElementById('announce-right');
    if(!announceRight) return;

    const sponsorImages = document.querySelectorAll('.sponsor-image');

    const imagePromises = Array.from(sponsorImages).map(img => {
        return new Promise((resolve, reject) => {
            if (img.complete && img.naturalHeight !== 0) {
                resolve();
            } else {
                img.addEventListener('load', () => {
                    if (img.naturalHeight !== 0) {
                        resolve();
                    } else {
                        reject();
                    }
                });
                img.addEventListener('error', reject);
            }
        });
    });

    Promise.all(imagePromises)
        .then(() => {
            announceRight.style.display = 'block';
            showRandomAnnouncement('announce-right', 10000);
        })
        .catch(() => {
            // do nothing
        });
}

async function main() {
    setupTermynal();
    showRandomAnnouncement('announce-left', 5000)
    handleSponsorImages();
}
document$.subscribe(() => {
    main()
})
