<template>
  <textarea ref="textAreaRef" class="editor"></textarea>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  nextTick,
  computed,
  watch,
} from "vue";
const { proxy } = getCurrentInstance();

import "suneditor/dist/css/suneditor.min.css";
import suneditor from "suneditor";
import plugins from "suneditor/src/plugins";
import lang from "suneditor/src/lang";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  extHeight: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
  },
});

const height = computed(() => {
  if (props.height) {
    return props.height;
  }
  return window.innerHeight - props.extHeight;
});

const emit = defineEmits(["update:modelValue"]);

const textAreaRef = ref();
const sunEditor = ref(null);

const init = () => {
  nextTick(() => {
    const editor = suneditor.create(textAreaRef.value, {
      lang: lang.zh_cn,
      height: height.value,
      plugins: plugins, // 引入所有插件
      buttonList: [
        ["undo", "redo"],
        ["font", "fontSize", "formatBlock"],
        ["paragraphStyle", "blockquote"],
        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
        ["fontColor", "hiliteColor", "textStyle"],
        ["removeFormat"],
        "/", // Line break
        ["outdent", "indent"],
        ["align", "horizontalRule", "list", "lineHeight"],
        ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
        /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
        ["fullScreen", "showBlocks", "codeView"],
        ["preview", "print"],
        ["save", "template"],
        /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
      ],
    });
    // 图片上传
    editor.onImageUploadBefore = (files, info, core, uploadHandler) => {
      proxy
        .Request({
          url: "file/uploadFile",
          params: {
            file: files[0],
          },
        })
        .then((res) => {
          if (!res) {
            return;
          }
          uploadHandler({
            result: [
              {
                url: "/api/file/getImage" + res.data,
                name: files[0].name,
                size: files[0].size,
              },
            ],
          });
        });
    };
    // 内容改变
    editor.onBlur = (event, core, contents) => {
      emit("update:modelValue", contents.innerHTML);
    };
    sunEditor.value = editor;
  });
};
init();

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (sunEditor.value) {
      sunEditor.value.setContents(newVal);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.editor {
  width: 100%;
}
</style>
