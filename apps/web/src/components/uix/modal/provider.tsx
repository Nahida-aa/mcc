"use client";

import { Store, useStore } from "@tanstack/react-store";
// import { Modal } from "@/app/(main)/@modal/modal"
import { LogOut } from "lucide-react";
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// import { AlertModal } from '../../../app/a/ui/modal/_comp/AlertModal'
// import { InputModal } from '../../../app/a/ui/modal/_comp/InputModal'
// import { LoadingModal } from '../../../app/a/ui/modal/_comp/LoadingModal'
import type z from "zod";
import { Modal } from "@/components/uix/modal/modal";
import { authClient } from "@/modules/auth/client";
import { useSession } from "@/modules/auth/hook/query";
import { ConfirmModal, type ConfirmVariant } from "./ConfirmModal";
// 模态框数据接口
export interface ModalData {
  // 通用属性
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  content?: ReactNode;

  // 确认模态框
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;

  // 提示模态框
  onSubmit?: (value: string) => void | Promise<void>;
  placeholder?: string;
  defaultValue?: string;
  inputSchema?: z.ZodString;

  // 加载模态框
  loadingText?: string;
  progress?: number;

  // 自定义模态框
  component?: ReactNode;
  disableDismissal?: boolean;
  props?: Record<string, any>;

  // 样式配置
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closable?: boolean;
  overlay?: boolean;
}

interface ShowConfirmParams {
  title: ReactNode;
  description?: ReactNode;
  onConfirm?: () => any | Promise<any>;
  variant?: ConfirmVariant;
  confirmText?: string;
}
// Context 类型定义
interface ModalContextType {
  // 当前模态框状态
  open: boolean;
  setOpen: (open: boolean) => void;
  type: ModalType | null;
  data: ModalData | null;

  // 控制方法
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  updateModal: (data: Partial<ModalData>) => void;

  // 便捷方法
  showAlert: (title: string, description?: string) => void;
  // showConfirm: (params: ShowConfirmParams) => void
  showInput: (
    title: string,
    placeholder?: string,
    onSubmit?: (value: string) => void | Promise<void>,
    defaultValue?: string,
    inputSchema?: z.ZodString,
  ) => void;
  showLoading: (text?: string, progress?: number) => void;
}
interface StoreState {
  open: boolean;
  type: ModalType | null;
  data: ModalData | null;
}
const store = new Store<StoreState>({
  open: false,
  type: null,
  data: null,
});
// Hook for using modal context
export function useModal() {
  const { open, type, data } = useStore(store, (state) => state);
  const setOpen = (open: boolean) =>
    store.setState((state) => ({ ...state, open }));
  const openModal = (modalType: ModalType, modalData?: ModalData) => {
    store.setState((prev) => ({
      data: modalData || {},
      open: true,
      type: modalType,
    }));
    console.log("openModal", modalType, modalData);
  };
  return {
    open,
    setOpen,
    type,
    data, // 打开模态框
    openModal,
    closeModal: () => {
      setOpen(false);
      // 延迟重置状态，等待动画完成
      setTimeout(() => {
        store.setState((state) => ({
          ...state,
          type: null,
          data: null,
        }));
      }, 200);
    },
    updateModal: (newData: Partial<ModalData>) => {
      store.setState((state) => ({
        ...state,
        data: { ...state.data, ...newData },
      }));
    },
    // 显示警告模态框
    showAlert: (title: string, description?: string) => {
      openModal("alert", {
        title,
        description,
        confirmText: "确定",
        closable: true,
      });
    },
    // 显示确认模态框
    showConfirm: ({
      title,
      description,
      onConfirm,
      variant = "info",
      confirmText,
    }: ShowConfirmParams) => {
      openModal("confirm", {
        title,
        description,
        onConfirm,
        variant,
        confirmText: confirmText || variant === "destructive" ? "删除" : "确定",
        cancelText: "取消",
        closable: true,
      });
    },
    // 显示输入提示模态框
    showInput: (
      title: string,
      placeholder?: string,
      onSubmit?: (value: string) => void | Promise<void>,
      defaultValue?: string,
      inputSchema?: z.ZodString,
    ) => {
      openModal("input", {
        title,
        placeholder,
        onSubmit,
        defaultValue,
        inputSchema,
        confirmText: "确定",
        cancelText: "取消",
        closable: true,
      });
    },
    // 显示加载模态框
    showLoading: (text?: string, progress?: number) => {
      openModal("loading", {
        loadingText: text || "加载中...",
        progress,
        closable: false,
        overlay: true,
      });
    },
  };
}
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <GlobalModalRenderer />
    </>
  );
};

// import { Modal } from "@/app/a/ui/modal/_comp/Modal";

// 模态框类型定义
export type ModalType = "confirm" | "alert" | "input" | "loading" | "custom";

export function GlobalModalRenderer() {
  const { open, setOpen, type, data, closeModal } = useModal();
  console.log("GlobalModalRenderer", open, type, data);
  if (!open || !type || !data) {
    return null;
  }

  // 根据类型渲染不同的模态框
  switch (type) {
    case "confirm":
      return (
        <ConfirmModal
          isOpen={open}
          onClose={closeModal}
          title={data.title}
          description={data.description}
          onConfirm={data.onConfirm}
          confirmText={data.confirmText}
          cancelText={data.cancelText}
          variant={data.variant}
        />
      );

    // case "alert":
    //   return (
    //     <AlertModal
    //       isOpen={open}
    //       onClose={closeModal}
    //       title={data.title || "提示"}
    //       description={data.description}
    //       confirmText={data.confirmText}
    //     />
    //   );

    // case "input":
    //   return (
    //     <InputModal
    //       isOpen={open}
    //       onClose={closeModal}
    //       title={data.title || "输入信息"}
    //       placeholder={data.placeholder}
    //       onSubmit={data.onSubmit}
    //       defaultValue={data.defaultValue}
    //       inputSchema={data.inputSchema}
    //       confirmText={data.confirmText}
    //       cancelText={data.cancelText}
    //     />
    //   );

    // case "loading":
    //   return (
    //     <LoadingModal
    //       isOpen={open}
    //       text={data.loadingText}
    //       progress={data.progress}
    //     />
    //   );

    case "custom":
      // return data.component || null;
      return (
        <Modal
          open={open}
          onOpenChange={setOpen}
          title={data.title}
          size={data.size}
          disableDismissal={data.disableDismissal}
          className={data.className}
        >
          {data.component || null}
        </Modal>
      );

    default:
      return null;
  }
}

// 便捷 hooks
export function useAlert() {
  const { showAlert } = useModal();
  return showAlert;
}

export function useConfirm() {
  const { showConfirm } = useModal()
  return showConfirm
}

export function usePrompt() {
  const { showInput } = useModal();
  return showInput;
}

export function useLoading() {
  const { showLoading, closeModal, updateModal } = useModal();

  return {
    showLoading,
    hideLoading: closeModal,
    updateProgress: (progress: number) => updateModal({ progress }),
  };
}

export function useSignOut() {
  const { showConfirm } = useModal();
  const { refetch } = useSession();
  return (name?: string) =>
    showConfirm({
      title: (
        <div className="flex gap-2">
          <LogOut className="text-destructive " />
          确认退出登录
        </div>
      ),
      description: name ? (
        <>
          您确定要退出{" "}
          <span className="font-medium text-foreground">{name}</span> 的账户吗？
        </>
      ) : (
        "您确定要退出当前账户吗？"
      ),
      onConfirm: () =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              refetch();
              // router.push("/");
              // 关闭模态框 是自动的
            },
            onError: (ctx) => {
              console.error("Sign out error:", ctx.error);
              throw new Error(ctx.error.message || "退出登录失败");
            },
          },
        }),
    });
}
