"use strict";

const BURGERS = [
  { id: "spicy", rank: 1, name: "麦辣鸡腿堡", votes: 98765, image: "assets/burger-spicy.png", card: "assets/card-spicy.png" },
  { id: "grilled", rank: 2, name: "板烧鸡腿堡", votes: 86543, image: "assets/burger-grilled.png", card: "assets/card-grilled.png" },
  { id: "bigmac", rank: 3, name: "巨无霸", votes: 72345, image: "assets/burger-bigmac.png", card: "assets/card-bigmac.png" },
  { id: "double-cheese", rank: 4, name: "双层吉士汉堡", votes: 54321, image: "assets/burger-double-cheese.png", card: "assets/card-double-cheese.png" },
  { id: "fish", rank: 5, name: "麦香鱼汉堡", votes: 43210, image: "assets/burger-fish.png", card: "assets/card-fish.png" }
];

const TASKS = [
  { id: "check-in", title: "每日进入活动页签到", reward: 1, detail: "每日上限 1 票", action: "去签到" },
  { id: "like-notes", title: "点赞 5 条活动笔记", reward: 1, detail: "每日上限 3 票", action: "去点赞" },
  { id: "save-notes", title: "收藏 3 条活动笔记", reward: 1, detail: "每日上限 3 票", action: "去收藏" },
  { id: "share", title: "分享当前活动页面", reward: 1, detail: "每日上限 1 票", action: "去分享" },
  { id: "receipt", title: "上传麦当劳消费小票", reward: 5, detail: "单笔消费 30 元起", action: "去上传" },
  { id: "publish", title: "带活动及对应汉堡话题发布笔记", reward: 3, detail: "每日上限 6 票", action: "去发布" },
  { id: "creator", title: "笔记每获 100 点赞", reward: 5, detail: "此方式上限为 25 票", action: "看规则" }
];

const NOTES = [
  { id: "n1", cover: "assets/note-01.jpg", ratio: "4 / 5", title: "这个麦辣鸡腿堡真的巨好吃！", author: "热辣汉堡研究员", avatar: "assets/avatar-01.jpg", likes: 8294, topic: "#世堡一麦辣鸡腿堡", burger: "spicy" },
  { id: "n2", cover: "assets/note-02.jpg", ratio: "4 / 5", title: "我最爱双层吉士汉堡，快给我家汉堡投票", author: "一口双层快乐", avatar: "assets/avatar-03.jpg", likes: 4317, topic: "#双层吉士出道", burger: "double-cheese" },
  { id: "n3", cover: "assets/note-03.jpg", ratio: "4 / 5", title: "双层吉士真的太香了，奶酪脑袋集合", author: "芝士加倍", avatar: "assets/avatar-02.jpg", likes: 2866, topic: "#双层吉士汉堡", burger: "double-cheese" },
  { id: "n4", cover: "assets/note-04.jpg", ratio: "4 / 5", title: "Pick 你心中最夯的汉堡", author: "汉堡搭子", avatar: "assets/avatar-04.jpg", likes: 9835, topic: "#麦当劳堡王争霸赛", burger: "bigmac" },
  { id: "n5", cover: "assets/note-05.jpg", ratio: "4 / 5", title: "一次测评五款汉堡，我的答案是它", author: "今日吃什么", avatar: "assets/avatar-05.jpg", likes: 15720, topic: "#汉堡大测评", burger: "grilled" },
  { id: "n6", cover: "assets/note-06.jpg", ratio: "4 / 5", title: "汉堡大测评！我最爱的是……", author: "脆薯不蘸酱", avatar: "assets/avatar-06.jpg", likes: 6655, topic: "#巨无霸", burger: "bigmac" },
  { id: "n7", cover: "assets/note-01.jpg", ratio: "4 / 5", title: "麦辣鸡腿堡党今天也在认真拉票", author: "辣堡后援会", avatar: "assets/avatar-04.jpg", likes: 3421, topic: "#世堡一麦辣鸡腿堡", burger: "spicy" },
  { id: "n8", cover: "assets/note-05.jpg", ratio: "4 / 5", title: "麦香鱼是懂温柔派汉堡的", author: "海盐气泡", avatar: "assets/avatar-01.jpg", likes: 1899, topic: "#麦香鱼汉堡", burger: "fish" }
];

const state = {
  tickets: 0,
  votes: Object.fromEntries(BURGERS.map((burger) => [burger.id, burger.votes])),
  completedTasks: new Set(),
  likedNotes: new Set(),
  shownSupportCards: new Set()
};

const heartIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78a5.5 5.5 0 0 0 0-7.78Z"/>
  </svg>`;

const numberFormatter = new Intl.NumberFormat("zh-CN");

function renderBurgers() {
  const list = document.querySelector("#burger-list");
  list.innerHTML = BURGERS.map((burger) => `
    <article class="rank-card">
      <div class="rank-number" aria-label="第 ${burger.rank} 名"><span>${burger.rank}</span></div>
      <img class="rank-product" src="${burger.image}" alt="${burger.name}" width="720" height="720">
      <div class="rank-copy">
        <h3>${burger.name}</h3>
        <p class="rank-votes"><strong data-votes="${burger.id}">${numberFormatter.format(state.votes[burger.id])}</strong> 人喜爱</p>
      </div>
      <button class="vote-button" type="button" data-vote-id="${burger.id}" aria-label="为${burger.name}投票">投票</button>
    </article>
  `).join("");

  const heroVotes = document.querySelector('[data-hero-votes="spicy"]');
  if (heroVotes) heroVotes.textContent = state.votes.spicy;
}

function renderTasks() {
  const list = document.querySelector("#task-list");
  list.innerHTML = TASKS.map((task) => {
    const completed = state.completedTasks.has(task.id);
    return `
      <article class="task-card">
        <div>
          <h3>${task.title}获取<strong>${task.reward}票</strong></h3>
          <p>${task.detail}</p>
        </div>
        <button class="task-button" type="button" data-task-id="${task.id}" ${completed ? "disabled" : ""}>
          ${completed ? "已完成" : task.action}
        </button>
      </article>
    `;
  }).join("");
}

function renderNotes() {
  const grid = document.querySelector("#note-grid");
  grid.innerHTML = NOTES.map((note) => {
    const liked = state.likedNotes.has(note.id);
    const count = note.likes + (liked ? 1 : 0);
    return `
      <article class="note-card">
        <img class="note-cover" src="${note.cover}" alt="${note.title}" width="900" height="1125" loading="lazy" style="aspect-ratio:${note.ratio}">
        <div class="note-copy">
          <h3>${note.title}</h3>
          <p class="note-topic">${note.topic}</p>
          <div class="note-meta">
            <img class="avatar" src="${note.avatar}" alt="" width="22" height="22" loading="lazy">
            <span class="author">${note.author}</span>
            <button class="like-button ${liked ? "is-liked" : ""}" type="button" data-like-id="${note.id}" aria-pressed="${liked}" aria-label="${liked ? "取消点赞" : "点赞"}${note.title}">
              ${heartIcon}<span>${formatLikes(count)}</span>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function formatLikes(value) {
  return value >= 10000 ? `${(value / 10000).toFixed(1).replace(".0", "")}万` : String(value);
}

function updateTicketCount() {
  document.querySelector("#ticket-count").textContent = state.tickets;
}

let toastTimer;
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function castVote(burgerId) {
  const burger = BURGERS.find((item) => item.id === burgerId);
  if (!burger) return;
  if (state.tickets < 1) {
    showToast("票数不足，完成任务可以继续投票");
    document.querySelector("#tasks").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  state.tickets -= 1;
  state.votes[burgerId] += 1;
  renderBurgers();
  updateTicketCount();
  showToast(`已为${burger.name}投出 1 票`);
  if (!state.shownSupportCards.has(burgerId)) {
    state.shownSupportCards.add(burgerId);
    openSupportCard(burger);
  }
}

let supportModalPreviousFocus = null;

function openSupportCard(burger) {
  const modal = document.querySelector("#support-modal");
  const image = document.querySelector("#support-card-image");
  if (!modal || !image) return;
  supportModalPreviousFocus = document.activeElement;
  image.src = burger.card;
  image.alt = `${burger.name}应援卡`;
  modal.hidden = false;
  document.body.classList.add("support-modal-open");
  requestAnimationFrame(() => modal.classList.add("is-visible"));
  modal.querySelector(".support-modal__close").focus();
}

function closeSupportCard() {
  const modal = document.querySelector("#support-modal");
  if (!modal || modal.hidden) return;
  modal.classList.remove("is-visible");
  document.body.classList.remove("support-modal-open");
  window.setTimeout(() => {
    modal.hidden = true;
    if (supportModalPreviousFocus && typeof supportModalPreviousFocus.focus === "function") {
      supportModalPreviousFocus.focus();
    }
  }, 180);
}

function completeTask(taskId) {
  const task = TASKS.find((item) => item.id === taskId);
  if (!task || state.completedTasks.has(taskId)) return;
  state.completedTasks.add(taskId);
  state.tickets += task.reward;
  renderTasks();
  updateTicketCount();
  showToast(`任务完成，获得 ${task.reward} 票`);
}

function toggleLike(noteId) {
  const note = NOTES.find((item) => item.id === noteId);
  if (!note) return;

  if (state.likedNotes.has(noteId)) {
    state.likedNotes.delete(noteId);
    renderNotes();
    showToast("已取消点赞");
    return;
  }

  state.likedNotes.add(noteId);
  renderNotes();
  playBurgerBurst(note.burger);
}

function playBurgerBurst(burgerId) {
  const burger = BURGERS.find((item) => item.id === burgerId) || BURGERS[0];
  const burst = document.querySelector("#like-burst");
  const image = document.querySelector("#like-burger");
  image.src = burger.image;
  burst.classList.remove("is-active");
  void burst.offsetWidth;
  burst.classList.add("is-active");
}

document.querySelector("#burger-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-vote-id]");
  if (button) castVote(button.dataset.voteId);
});

document.querySelector("#task-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-task-id]");
  if (button) completeTask(button.dataset.taskId);
});

document.querySelector("#note-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-like-id]");
  if (button) toggleLike(button.dataset.likeId);
});

document.querySelector("#support-modal").addEventListener("click", (event) => {
  if (event.target.closest("[data-support-close]")) closeSupportCard();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeSupportCard();
});

renderBurgers();
renderTasks();
renderNotes();
updateTicketCount();
