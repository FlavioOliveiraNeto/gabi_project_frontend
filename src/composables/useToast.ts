import { reactive } from "vue";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  open?: boolean;
}

interface State {
  toasts: Toast[];
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const state = reactive<State>({
  toasts: [],
});

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) return;

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    remove(toastId);
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

function add(toast: Omit<Toast, "id">) {
  const id = genId();

  const newToast: Toast = {
    ...toast,
    id,
    open: true,
  };

  state.toasts = [newToast, ...state.toasts].slice(0, TOAST_LIMIT);

  return {
    id,
    dismiss: () => dismiss(id),
    update: (props: Partial<Toast>) => update(id, props),
  };
}

function update(id: string, props: Partial<Toast>) {
  state.toasts = state.toasts.map((t) =>
    t.id === id ? { ...t, ...props } : t,
  );
}

function dismiss(id?: string) {
  if (id) {
    addToRemoveQueue(id);
  } else {
    state.toasts.forEach((t) => addToRemoveQueue(t.id));
  }

  state.toasts = state.toasts.map((t) =>
    !id || t.id === id ? { ...t, open: false } : t,
  );
}

function remove(id?: string) {
  if (!id) {
    state.toasts = [];
  } else {
    state.toasts = state.toasts.filter((t) => t.id !== id);
  }
}

export function useToast() {
  return {
    toasts: state.toasts,
    toast: add,
    dismiss,
  };
}
