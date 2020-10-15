<template functional>
  <div class="VueLive-container">
    <div class="VueLive-editor">
      <slot name="editor" />
    </div>
    <div class="VueLivePreview">
      <slot name="preview" />
    </div>
  </div>
</template>

<style>
.VueLive-container {
  display: flex;
}
.VueLive-editor {
  width: 50%;
}
.VueLivePreview {
  background-color: white;
  width: 50%;
}
</style>
