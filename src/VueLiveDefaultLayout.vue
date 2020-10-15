<template functional>
  <div :class="$style.container">
    <div :class="$style.editor">
      <slot name="editor" />
    </div>
    <div :class="$style.preview">
      <slot name="preview" />
    </div>
  </div>
</template>

<style module="VueLive">
.container {
  display: flex;
}
.editor {
  width: 50%;
}
.preview {
  background-color: white;
  width: 50%;
}
</style>
