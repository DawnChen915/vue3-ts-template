<template>
  <h1>grid测试页面</h1>
  <div class="container">
    <div class="header"></div>
    <div class="sidebar"></div>
    <div class="main"></div>
    <div class="footer"></div>

  </div>
  <div class="container2">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>
<script setup lang='ts'>

interface Article {
  title: string;
  content: string;
  author: string;
  date: string;
  id: number;
}
type CreateArticle = Omit<Article, 'id' | 'date'> & Partial<Pick<Article, 'id' | 'date'>>;
const createArticle = (article: CreateArticle) => {
  article.id = 1;
  article.date = '2021-10-10';
  return article as Article;
}


console.log('CreateArticle');
</script>

<style scoped>
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(200px, auto);
  /* 创建三列 */
  grid-gap: 20px;
  /* 列之间的间距 */
}

@media (max-width: 600px) {
  .container {
    grid-template-areas:
      "header header header"
      "main main main"
      "footer footer footer";
  }
}

.header {
  grid-area: header;
  background-color: red;
}

.sidebar {
  grid-area: sidebar;
  background-color: green;
}

.main {
  grid-area: main;
  background-color: blue;
}

.footer {
  grid-area: footer;
  background-color: yellow;
}

.container2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  grid-gap: 20px;

  /* 列之间的间距 */
  div {
    background-color: red;
    height: 100px;
  }
}
</style>
