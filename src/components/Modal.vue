<script setup>
import { ref } from 'vue'

const showModal = ref(false)

defineExpose({
    open, close
})

function open() {
    showModal.value = true
}

function close(e) {
    console.log('on close')
    console.log('t: ' + e.target + ' ct: ' + e.currentTarget)
    showModal.value = false
}

</script>

<template>
    <div v-show="showModal" class="modal-backdrop" @click.self="close">
        <div class="modal">
            <section class="split">
                <header>
                    <slot name="header"></slot>
                    <!--<div><button class="button" @click.stop="close">Close</button></div>-->
                </header>
                <div>
                    <main>
                        <slot name="main"></slot>
                    </main>
                    <footer>
                        <slot name="footer"></slot>
                    </footer>
                </div>

            </section>
            
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--modal-backdrop-clr);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color:black;
    padding: 75px;
}

.modal-button:hover {
    background-color: var(--clr-accent-200);
    border-radius: 50%;
}

/*header {
    display: flex;
    margin-bottom: var(--size-100);
    justify-content: space-between;
}

header > img {
    margin-left: var(--size-500);
}*/

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--size-400);
}

.highlight {
    background-color: yellow;
}

</style>