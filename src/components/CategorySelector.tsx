import type { WorkCategory } from "../types";

interface props {
  categories: WorkCategory[];
  inputValue: string;
  selectedCategory: string;
  setInputValue: (v: string) => void;
  confirmCategory: () => void;
}

export function CategorySelector({
  inputValue,
  confirmCategory,
  setInputValue,
  categories,
  selectedCategory,
}: props) {
  return (
    <>
      <input
        list="categories"
        placeholder="作業内容を入力 / 選択"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />

      <button onClick={confirmCategory}>確定</button>

      <datalist id="categories">
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name} />
        ))}
      </datalist>

      {selectedCategory && (
        <p>
          現在の作業：<strong>{selectedCategory}</strong>
        </p>
      )}
    </>
  );
}
