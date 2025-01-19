import { format } from 'date-fns';

interface CardProps {
	name: string;
	slug: string;
	category: string;
	description: string;
	cover: string;
	created_at: string;
}

const Card = (item: CardProps) => {

	const createdAt = new Date(item.created_at);
	const formattedDate = format(createdAt, 'EEEE, dd MMMM yyyy');

	return `
        <a href="/post/${item.slug}" class="card">
            <img class="card__img" src="${item.cover}" alt="${item.name}" />
            <div class="card__content">
                <h4 class="card__title">${item.name}</h4>

                <p class="card__summary">${item.description}</p>

                <div class="card__extra">
                    <span class="badge pill">${item.category}</span>

                    <div class="small_text">${formattedDate}</div>
                </div>
            </div>
        </a>
	`;
};

export default Card;
