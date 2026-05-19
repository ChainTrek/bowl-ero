import { useEffect, useMemo, useState } from 'react';
import { getPublicCafeMenuItems } from '../../services/supabase/publicCafeMenu';

export default function CafeMenuSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadMenuItems() {
      try {
        setLoading(true);
        const data = await getPublicCafeMenuItems();
        setItems(data);
      } catch (error) {
        setErrorMessage(`Unable to load cafe menu: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadMenuItems();
  }, []);

  const groupedItems = useMemo(() => {
    return items.reduce((groups, item) => {
      const category = item.category || 'Menu Items';

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(item);
      return groups;
    }, {});
  }, [items]);

  return (
    <section className="cafe-menu-section">
      <div className="cafe-menu-section__inner">
        <h2>Cafe Menu</h2>

        {loading ? (
          <p>Loading menu...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : items.length === 0 ? (
          <p>No menu items available right now.</p>
        ) : (
          <div className="cafe-menu-section__groups">
            {Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div className="cafe-menu-group" key={category}>
                <h3>{category}</h3>

                <div className="cafe-menu-grid">
                  {categoryItems.map((item) => (
                    <article className="menu-card" key={item.id}>
                      {item.image_url && (
                        <img
                          className="menu-card__image"
                          src={item.image_url}
                          alt={item.name}
                        />
                      )}

                      <div className="menu-card__content">
                        <div className="menu-card__header">
                          <h4>{item.name}</h4>
                          {item.price !== null && item.price !== undefined && (
                            <span>${Number(item.price).toFixed(2)}</span>
                          )}
                        </div>

                        {item.description && <p>{item.description}</p>}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}