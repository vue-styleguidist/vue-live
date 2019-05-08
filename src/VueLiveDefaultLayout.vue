<template functional>
  <div
    class="vue-live-container"
    style="display:flex; width:950px; max-width:95vw; margin:20px auto;"
  >
    <div style="width:50%;">
      <slot name="editor"></slot>
    </div>
    <div style="background-color:white;width:50%;padding:20px;">
      <slot name="preview"></slot>
    </div>
  </div>
</template>
