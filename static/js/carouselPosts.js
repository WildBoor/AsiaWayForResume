document.querySelector('.top_posts').addEventListener('click', (e) => {
    carouselClickCheck(e.target);
})

function carouselClickCheck(target) {
    let targetNextBtn = target.closest('.carousel_next');
    let targetPreviousBtn = target.closest('.carousel_previous');
    let nextBtn = document.querySelector('.carousel_next');
    let previousBtn = document.querySelector('.carousel_previous');
    let carouselPostsBlock = document.querySelector('.carousel_posts');
    let allCarouselPosts = carouselPostsBlock.children;
    let carouselPostsBlockDataset = carouselPostsBlock.dataset;
    let carouselPostsTotal = carouselPostsBlock.children.length;
    let carouselPostWidth = allCarouselPosts[0].offsetWidth;
    let translateXStep = carouselPostWidth + 15;
    let translateX;
    let amountOfReplacingPosts = 3;

    if (targetNextBtn) {
        let hiddenPostsRightTotal = +carouselPostsBlockDataset.hiddenRight;

        if (!hiddenPostsRightTotal) {
            hiddenPostsRightTotal = carouselPostsTotal - amountOfReplacingPosts;
            carouselPostsBlock.setAttribute('data-hidden-right', hiddenPostsRightTotal);
            previousBtn.classList.toggle('hide');
        }

        if (hiddenPostsRightTotal < amountOfReplacingPosts) {
            carouselPostsBlockDataset.hiddenLeft = +carouselPostsBlockDataset.hiddenLeft + hiddenPostsRightTotal;
            translateX = carouselPostsBlockDataset.hiddenLeft * translateXStep;
            carouselPostsBlockDataset.hiddenRight = 0;
        } else {
            translateX = translateXStep * (carouselPostsBlockDataset.hiddenLeft + amountOfReplacingPosts);
            carouselPostsBlockDataset.hiddenLeft = +carouselPostsBlockDataset.hiddenLeft + amountOfReplacingPosts;
            carouselPostsBlockDataset.hiddenRight = +carouselPostsBlockDataset.hiddenRight - amountOfReplacingPosts;
        }

        for (let post of allCarouselPosts) {
            post.style.transform = `translateX(-${translateX}px)`;
        }
    }

    if (targetPreviousBtn) {
        let hiddenPostsLeftTotal = carouselPostsBlockDataset.hiddenLeft;

        if (hiddenPostsLeftTotal > amountOfReplacingPosts) {
            carouselPostsBlockDataset.hiddenLeft = +carouselPostsBlockDataset.hiddenLeft - amountOfReplacingPosts;
            carouselPostsBlockDataset.hiddenRight = +carouselPostsBlockDataset.hiddenRight + amountOfReplacingPosts;
            translateX = carouselPostsBlockDataset.hiddenLeft * translateXStep;
        }

        if (hiddenPostsLeftTotal <= amountOfReplacingPosts) {
            translateX = 0;
            carouselPostsBlockDataset.hiddenLeft = 0;
            carouselPostsBlockDataset.hiddenRight = carouselPostsTotal - amountOfReplacingPosts;
        }

        for (let post of allCarouselPosts) {
            post.style.transform = `translateX(-${translateX}px)`;
        }
    }

    if (targetNextBtn || targetPreviousBtn) {
        
        if (!(+carouselPostsBlockDataset.hiddenRight)) {
            nextBtn.classList.toggle('hide');
        }

        if (+carouselPostsBlockDataset.hiddenRight && nextBtn.classList.contains('hide')) {
            nextBtn.classList.toggle('hide');
        }

        if (!(+carouselPostsBlockDataset.hiddenLeft)) {
            previousBtn.classList.toggle('hide');
        }

        if (+carouselPostsBlockDataset.hiddenLeft && previousBtn.classList.contains('hide')) {
            previousBtn.classList.toggle('hide');
        }
    }
}

