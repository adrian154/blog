# Linear Regresssion

* A **model** predicts the value of some process based on some inputs
* We can quantify how good our model is using an error function
* Goal is to adjust the model so that error is minimized
* Example of an error function: mean squared error (MSE) 
    * Sum of squared errors
    * Because the error is squared, underestimation (negative) and overestimation are considered equally 
    * $\text{MSE} = \frac1{2n} \sum_{i=1}^n (y'_i - y_i)^2$
* How do we minimize MSE?
    * Example: linear regression
        * We want to find $m$ and $b$ that result in lowest MSE
        * Many optimization methods available
        * We could just try random values of $m$ and $b$, but that would be slow
        * Real models need to handle situations that may not be linear; more complicated models have more inputs
        * One method that works well is **gradient descent**

# Gradient Descent

* In calculus, we minimize functions by finding relative minima (points where the derivative is zero)
* But in our situation, we have multiple variables. How do we minimize a multivariable function?
    * **Partial derivative**: derivative of a multivariable function where we pretend every variable except one is constant
    * Example: if $f(\theta_1, \theta_2)$ is our error function, where $\theta_1$ and $\theta_2$ are the parameters to our model, the derivative of $f$ if we hold $\theta_2$ constant is written as $\frac{\partial f}{\partial \theta_1}$.
* Gradient descent process:
    * Suppose we have some cost function/error function $J(\theta_0, \theta_1 \ldots \theta_n)$
    * Start with initial guess for our model parameters (we could start with all of them equal to zero) 
    * We can use partial derivatives to determine how changing a parameter will affect the error function
    * Adjust each parameter based on its partial derivative:
    * $$\theta_i = \theta_i - \alpha \frac{\partial J(\theta_0, \theta_1 \ldots \theta_n)}{\partial \theta_i}$$
        * **Why this equation:** If $\frac{\partial J}{\partial \theta_i} > 0$, then increasing $\theta_i$ will increase $J$, so we should decrease $\theta_i$ to minimize $J$, and vice versa. If we keep repeating this process, we will eventually get closer and closer to a point where $\frac{\partial J}{\partial \theta_i} = 0$, which is a relative minimum.
    * $\alpha$ is the learning rate
        * $\alpha$ determines how much we change the parameter in response to the partial derivative
        * Greater value may mean fewer iterations until we reach the relative minimum, but it may also miss optimal solutions
* How do we determine the partial derivative?
    * Recall that $\frac{df}{dx} = \lim_{\Delta x \to 0} \frac{f(x + \Delta x) - f(x)}{\Delta x}$
    * We can increase the parameter slightly, evaluate the error function, divide the change in the error function by the change in the parameter to approximate the partial derivative

