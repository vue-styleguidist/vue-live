<template functional>
  <div class="preview-code">
    <div>
      <slot name="editor"></slot>
    </div>
    <div>
      <slot name="preview"></slot>
    </div>
  </div>
</template>
<style>
.preview-code {
  display: flex;
  width: 950px;
  margin: 30px auto;
  border-radius: 10px;
  border: 1px solid #ccc;
  overflow: hidden;
}

.preview-code > div {
  width: 100%;
}
</style>