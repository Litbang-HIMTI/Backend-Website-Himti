export interface DocumentResult<T> {
	_doc: T;
}
export type TVisibility = "public" | "draft" | "private";
export const validVisibility: TVisibility[] = ["public", "draft", "private"];
