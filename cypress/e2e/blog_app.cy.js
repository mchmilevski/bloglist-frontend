describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      name: 'root',
      username: 'root',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)

    cy.visit('')
  })

  it('front page can be opened', function() {
    cy.contains('Blogs App')
  })

  describe('Login',function() {
    it('Login form is shown', function() {
      cy.get('#username').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.get('#login-button').should('be.visible')
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'secret' })
    })

    it('A blog can be created', function() {
      cy.contains('New blog').click()
      cy.get('#title').type('a blog created by cypress')
      cy.get('#author').type('cypress')
      cy.get('#url').type('cypress url')
      cy.get('#new-blog-button').click()

      cy.contains('a blog created by cypress')
    })

    describe('And several blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({ title: 'first blog', author: 'cypress', url: 'cypress' })
        cy.createBlog({ title: 'second blog', author: 'cypress', url: 'cypress' })
        cy.createBlog({ title: 'third blog', author: 'cypress', url: 'cypress' })
      })

      it('An user can click the view button', function() {
        cy.contains('first blog')
          .parent()
          .parent()
          .find('#view-button')
          .as('viewButton')

        cy.get('@viewButton').click()
        cy.get('@viewButton').should('not.be.visible')
      })

      describe('And the user is viewing a blog', function() {
        beforeEach(function () {
          cy.contains('first blog')
            .parent()
            .parent()
            .find('#view-button')
            .click()
        })

        it('An user can click the like button', function() {
          cy.contains('first blog')
            .parent()
            .parent()
            .find('#like-button')
            .as('likeButton')

          cy.get('@likeButton').click()
        })

        it('Blogs are ordered descending based on likes number', function() {
          // Like 2 times first blog
          cy.contains('first blog')
            .parent()
            .parent()
            .find('#like-button')
            .as('firstLikeButton')

          cy.wait(500).get('@firstLikeButton').click()
          cy.wait(500).get('@firstLikeButton').click()

          //Like 3 times third blog
          cy.contains('third blog')
            .parent()
            .parent()
            .find('#view-button')
            .click()

          cy.contains('third blog')
            .parent()
            .parent()
            .find('#like-button')
            .as('thirdLikeButton')

          cy.wait(500).get('@thirdLikeButton').click()
          cy.wait(500).get('@thirdLikeButton').click()
          cy.wait(500).get('@thirdLikeButton').click()

          cy.visit('')
          cy.get('.blog').eq(0).should('contain', 'third blog')
          cy.get('.blog').eq(1).should('contain', 'first blog')
          cy.get('.blog').eq(2).should('contain', 'second blog')

        })

        it('The user who created the blog can also delete it', function() {
          cy.contains('first blog')
            .parent()
            .contains('Delete')
            .click()
          cy.should('not.contain', 'first blog')
        })
      })

      describe('And other user is viewing a blog', function() {
        it('He cannot see the delete button of the blog he did not create', function() {
          cy.contains('Log out').click()
          const user = {
            name: 'root2',
            username: 'root2',
            password: 'secret'
          }
          cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
          cy.login({ username: 'root2', password: 'secret' })

          cy.contains('root2 logged in')
          cy.contains('first blog').parent().should('not.contain', 'Delete')
        })
      })
    })
  })
})