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
      <div className="input-group">
        <input
          list="categories"
          placeholder="Type or Select Activity..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="primary-btn" onClick={confirmCategory}>
          確定
        </button>
      </div>

      <datalist id="categories">
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name} />
        ))}
      </datalist>

      {selectedCategory && (
        <div className="current-activity">
          タスク: <strong>{selectedCategory}</strong>
        </div>
      )}
    </>
  );
}
