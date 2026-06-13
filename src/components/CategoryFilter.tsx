'use client';

interface CategoryFilterProps {
  categories: { value: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  metalType?: 'gold' | 'silver';
}

export default function CategoryFilter({ categories, activeCategory, onCategoryChange, metalType = 'gold' }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <button
        className={`category-pill ${activeCategory === 'all' ? (metalType === 'gold' ? 'active-gold' : 'active-silver') : ''}`}
        onClick={() => onCategoryChange('all')}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          className={`category-pill ${activeCategory === cat.value ? (metalType === 'gold' ? 'active-gold' : 'active-silver') : ''}`}
          onClick={() => onCategoryChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
